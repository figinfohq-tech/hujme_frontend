import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import SignUp from "../pages/agents/SignUp";
import MainAuth from "@/pages/authentications/MainAuth";
import NavBar from "@/components/NavBar";
import PageNotFound from "@/pages/PageNotFound";
import AgentSidebar from "@/components/AgentSideBar";
import { User } from "@/pages/user/User";
import ProtectedRoute from "@/pages/agents/ProtectedRoute";
import AgentRegistration from "@/pages/agents/AgentRegistration";
import Packages from "@/pages/agents/Packages";
import SearchResults from "@/pages/SearchResult";
import UserSideBar from "@/components/UserSideBar";
import PackageDetails from "@/pages/agents/PackageDetails";
import ComparePackages from "@/pages/agents/ComparePackages";
import { BookingFlow } from "@/pages/BookingFlow";
import ProtectedBookFlow from "@/pages/agents/ProtectedBookFlow";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import ChoosePaymentOption from "@/pages/ChoosePaymentOption";
import { BookingsPage } from "@/pages/agents/BookingsPage";
import BookingViewPage from "@/pages/agents/BookingView";

const MainRouts = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  return (
    <>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<MainAuth />} />
        <Route path="/agent" element={<SignUp />} />
        <Route path="/agent-registration" element={<AgentRegistration />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/package/:id" element={<PackageDetails />} />
        <Route path="/compare" element={<ComparePackages />} />
        <Route
          path="/booking-detail"
          element={
            <ProtectedBookFlow>
              {" "}
              <BookingFlow />{" "}
            </ProtectedBookFlow>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <ProtectedBookFlow>
              {" "}
              <BookingConfirmation />{" "}
            </ProtectedBookFlow>
          }
        />
        {/* Role-Based Protected Routes */}
        {role === "USER" ? (
          <Route path="/customer" element={<UserSideBar />}>
            <Route index element={<User />} />
            <Route path="overview" element={<h1>Overview Page</h1>} />
            <Route path="packages" element={<Home />} />
            <Route path="search" element={<SearchResults />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="booking-view" element={<BookingViewPage />} />
            <Route path="profiles" element={<h1>Profiles Page</h1>} />
            <Route path="analytics" element={<h1>Analytics Page</h1>} />
          </Route>
        ) : role === "AGENT" ? (
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AgentSidebar />
              </ProtectedRoute>
            }
          >
            <Route index element={<h1>Overview Page</h1>} />
            <Route path="overview" element={<h1>Overview Page</h1>} />
            <Route path="packages" element={<Packages />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="booking-view" element={<BookingViewPage />} />
            <Route path="profiles" element={<h1>Profiles Page</h1>} />
            <Route path="analytics" element={<h1>Analytics Page</h1>} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/auth" replace />} />
        )}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default MainRouts;
