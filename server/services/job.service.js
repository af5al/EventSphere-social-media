const JobPost = require("../models/JobPostModel");
const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel");
const ApiError = require("../util/ApiError");

class JobService {
  async getJobsForUser(userId) {
    const user = await User.findById(userId);
    const posts = await JobPost.find({
      isBlocked: false,
      vaccancies: { $gt: 0 },
      eventId: { $in: user?.following || [] },
      appliedUsers: { $nin: [userId] },
      acceptedUsers: { $nin: [userId] },
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

    return posts;
  }

  async applyJob(userId, jobId) {
    const post = await JobPost.findById(jobId);
    if (!post) throw new ApiError(404, "Job post not found");
    if (post.vaccancies <= 0) throw new ApiError(400, "No vacancies remaining for this job");

    if (post.appliedUsers.includes(userId)) {
      throw new ApiError(400, "Already applied to this job");
    }

    post.appliedUsers.push(userId);
    post.vaccancies -= 1;
    await post.save();

    const user = await User.findById(userId);
    await Notification.create({
      recieverId: post.eventId,
      senderId: userId,
      notificationMessage: `${user?.username || "A user"} applied for the ${post.title} job`,
      actionOn: {
        model: "jobPost",
        objectId: post._id,
      },
      date: new Date(),
    });

    return post;
  }

  async getUserJobStats(userId) {
    const appliedJobs = await JobPost.find({
      appliedUsers: { $in: [userId] },
    }).populate("eventId");

    const invites = await JobPost.find({
      acceptedUsers: { $in: [userId] },
    }).populate("eventId");

    return [
      { label: "Applied Jobs", data: appliedJobs },
      { label: "Invites", data: invites },
    ];
  }

  async searchJobsForUser(userId, searchTerm) {
    const regexPattern = new RegExp(searchTerm, "i");
    const user = await User.findById(userId);

    const results = await JobPost.find({
      $and: [
        {
          $or: [
            { title: { $regex: regexPattern } },
            { location: { $regex: regexPattern } },
          ],
        },
        { isBlocked: false },
        { vaccancies: { $gt: 0 } },
        { eventId: { $in: user?.following || [] } },
        { appliedUsers: { $nin: [userId] } },
        { acceptedUsers: { $nin: [userId] } },
      ],
    });

    return results;
  }

  // ==================== EVENT ORGANIZER JOB METHODS ====================

  async addJobPost(eventId, jobData) {
    const newJob = new JobPost({
      eventId,
      title: jobData.title,
      description: jobData.description,
      location: jobData.location,
      salary: jobData.salary,
      vaccancies: jobData.vaccancies,
      experience: jobData.experience,
      skills: jobData.skills,
      qualification: jobData.qualification,
    });
    return await newJob.save();
  }

  async getJobPostsByEvent(eventId) {
    return await JobPost.find({ eventId }).sort({ createdAt: -1 });
  }

  async editJobPost(jobId, jobData) {
    const updated = await JobPost.findByIdAndUpdate(jobId, { $set: jobData }, { new: true });
    if (!updated) throw new ApiError(404, "Job post not found to update");
    return updated;
  }

  async deleteJobPost(jobId) {
    const deleted = await JobPost.findByIdAndDelete(jobId);
    if (!deleted) throw new ApiError(404, "Job post not found to delete");
    return deleted;
  }

  async toggleBlockJobPost(jobId) {
    const job = await JobPost.findById(jobId);
    if (!job) throw new ApiError(404, "Job post not found");
    job.isBlocked = !job.isBlocked;
    await job.save();
    return job;
  }

  async getAppliedUsers(jobId) {
    const job = await JobPost.findById(jobId).populate("appliedUsers");
    if (!job) throw new ApiError(404, "Job post not found");
    return job.appliedUsers;
  }

  async acceptJobRequest(jobId, userId) {
    const job = await JobPost.findById(jobId);
    if (!job) throw new ApiError(404, "Job post not found");

    job.appliedUsers = job.appliedUsers.filter((id) => id.toString() !== userId.toString());
    if (!job.acceptedUsers.includes(userId)) {
      job.acceptedUsers.push(userId);
    }
    await job.save();

    await Notification.create({
      recieverId: userId,
      senderId: job.eventId,
      notificationMessage: `Congratulations! Your application for "${job.title}" has been accepted.`,
      actionOn: {
        model: "jobPost",
        objectId: job._id,
      },
      date: new Date(),
    });

    return job;
  }

  async getEventJobStats(eventId, jobId) {
    if (jobId) {
      const job = await JobPost.findById(jobId)
        .populate("appliedUsers")
        .populate("acceptedUsers");
      return job;
    }
    const allJobs = await JobPost.find({ eventId });
    return allJobs;
  }

  async searchEventJobs(eventId, searchTerm) {
    const regexPattern = new RegExp(searchTerm, "i");
    return await JobPost.find({
      eventId,
      $or: [
        { title: { $regex: regexPattern } },
        { location: { $regex: regexPattern } },
      ],
    });
  }
}

module.exports = new JobService();
