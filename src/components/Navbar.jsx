import { Link, useLocation } from "react-router-dom";
import React from "react";
import { UserButton, useUser } from "@clerk/react";
import { AsteriskIcon, HistoryIcon, LayoutDashboardIcon } from "lucide-react";

const Navbar = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const location = useLocation();

  // Loading state guard
  if (!isLoaded) return null;

  // Temporary fallback for local UI testing if not signed in with Clerk yet
  const authenticated = isSignedIn ?? true;

  const userName =
    user?.fullName ||
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "User";

  return (
    <header className="w-full max-w-[1220px] mx-auto bg-white/90 backdrop-blur xl:rounded-b-xl sticky top-0 z-40 px-6 py-4 flex items-center justify-between border border-slate-200">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-1.5">
          <img src="/logo.svg" alt="Meetup Logo" className="w-6 h-6" />
          <span className="text-2xl font-medium tracking-tight text-slate-900 flex items-center">
            Meetup<span className="text-blue-600">.</span>
          </span>
        </Link>

        {authenticated && (
          <nav className="flex items-center gap-1.5 ml-2">
            <Link
              to="/dashboard"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === "/dashboard"
                  ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboardIcon className="w-3.5 h-3.5" />
              Dashboard
            </Link>

            <Link
              to="/sessions"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === "/sessions"
                  ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <HistoryIcon className="w-3.5 h-3.5" />
              Sessions
            </Link>

            <Link
              to="/pricing"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                location.pathname === "/pricing"
                  ? "ring ring-blue-100 bg-blue-50 text-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <AsteriskIcon className="w-3.5 h-3.5" />
              Pricing
            </Link>
          </nav>
        )}
      </div>

      {authenticated && (
        <div className="flex items-center gap-4">
          <span className="font-medium hidden sm:inline tracking-wide text-sm text-slate-700">
            Welcome, {userName}
          </span>
          <UserButton />
        </div>
      )}
    </header>
  );
};

export default Navbar;