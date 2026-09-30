import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { adminRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import {
  FiUsers,
  FiCalendar,
  FiShield,
  FiArrowRight,
  FiVideo,
  FiMessageSquare,
  FiBriefcase,
  FiAward,
} from "react-icons/fi";
import BannerCourosel from "../components/BannerCourosel";

function LandingPage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = () => {
    adminRequest({
      url: apiEndPoints.getClientBanners,
      method: "get",
    })
      .then((res) => {
        if (res.data?.banners?.length) {
          setBanners(res.data.banners);
        }
      })
      .catch((err) => {
        console.error("Banner fetch notice:", err.message);
      });
  };

  return (
    <div className="min-h-screen bg-[#090C15] text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#090C15]/75 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate(ServerVariables.Landing)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                <img src="/images/Es.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-display">
              EventSphere
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to={ServerVariables.AdminLogin}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <FiShield className="text-sm" /> Admin
            </Link>

            <Link
              to={ServerVariables.eventLogin}
              className="text-xs sm:text-sm font-semibold text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700/80 hover:border-slate-600 hover:bg-slate-800/60 transition-all shadow-sm"
            >
              Organizer Portal
            </Link>

            <Link
              to={ServerVariables.Login}
              className="text-xs sm:text-sm font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-fade-in shadow-inner">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          The Next-Generation Event & Social Network
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.1] font-display">
          Where Extraordinary Events Meet{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Seamless Networking
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-2xl font-normal leading-relaxed">
          Connect with event organizers, view disappearing 24-hr stories, chat in real-time,
          hop on 1-on-1 video calls, and explore industry job postings.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate(ServerVariables.Login)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <FiUsers className="text-lg" />
            Join as Attendee
            <FiArrowRight className="text-lg" />
          </button>

          <button
            onClick={() => navigate(ServerVariables.eventRegister)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            <FiCalendar className="text-lg" />
            Host an Event
          </button>
        </div>

        {/* Banners carousel if available */}
        {banners.length > 0 && (
          <div className="mt-16 w-full max-w-5xl rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl shadow-black/80">
            <BannerCourosel banners={banners} />
          </div>
        )}

        {/* Interactive Role Cards */}
        <section className="mt-24 w-full">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
              Choose Your Experience
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
              Who are you logging in as?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* User Card */}
            <div
              onClick={() => navigate(ServerVariables.Login)}
              className="group p-6 sm:p-8 rounded-2xl bg-[#111726]/80 hover:bg-[#151D30] border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-indigo-950/30 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiUsers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Attendee / Member
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Discover events, follow premier organizers, comment on community posts, enjoy live video calls, and apply for exclusive hiring listings.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-indigo-400 font-semibold text-sm">
                <span>Enter User Feed</span>
                <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Organizer Card */}
            <div
              onClick={() => navigate(ServerVariables.eventLogin)}
              className="group p-6 sm:p-8 rounded-2xl bg-[#111726]/80 hover:bg-[#151D30] border border-slate-800/80 hover:border-purple-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-950/30 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiCalendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  Event Organizer
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Publish event updates, publish 24-hr stories, post open job vacancies, interview candidates over video, and subscribe to premium plans.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-purple-400 font-semibold text-sm">
                <span>Organizer Dashboard</span>
                <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>

            {/* Admin Card */}
            <div
              onClick={() => navigate(ServerVariables.AdminLogin)}
              className="group p-6 sm:p-8 rounded-2xl bg-[#111726]/80 hover:bg-[#151D30] border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-950/30 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <FiShield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Platform Admin
                </h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                  Monitor platform revenue, oversee member and organizer verification, manage subscriptions, and curate spotlight banners.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-cyan-400 font-semibold text-sm">
                <span>Admin Console</span>
                <FiArrowRight className="group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="mt-28 w-full border-t border-slate-800/80 pt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <FiMessageSquare className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">Real-Time Chat</h4>
              <p className="text-xs text-slate-400 mt-1">Instant Socket.io direct messaging with read receipts</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <FiVideo className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">WebRTC Video Calls</h4>
              <p className="text-xs text-slate-400 mt-1">Seamless 1-on-1 video rooms powered by ZegoUIKit</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <FiBriefcase className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">Job Portal</h4>
              <p className="text-xs text-slate-400 mt-1">Recruit event staff and apply with custom CV uploads</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <FiAward className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h4 className="font-bold text-white text-base">Monetized Plans</h4>
              <p className="text-xs text-slate-400 mt-1">Tiered organizer subscriptions via PayPal REST SDK</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090C15] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EventSphere Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
