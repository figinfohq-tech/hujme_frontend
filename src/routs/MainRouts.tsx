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
import { BookingsPage } from "@/pages/agents/BookingsPage";
import BookingViewPage from "@/pages/agents/BookingView";
import { AddNewPackage } from "@/pages/agents/AddNewPackage";
import PackageView from "@/pages/agents/PackageView";
import { DocumentsPage } from "@/pages/user/DocumentsPage";
import { DocumentsAgent } from "@/pages/agents/DocumentsAgent";
import { ManageBookings } from "@/pages/agents/ManageBookings";
import { BookingDetailsPage } from "@/pages/agents/BookingDetailsPage";
import ForgotPassword from "@/pages/authentications/ForgotPassword";
import ResetPassword from "@/pages/authentications/ResetPassword";
import { ReviewsPage } from "@/pages/user/ReviewsPage";
import ProfilePage from "@/pages/agents/ProfilePage";
import UserProfle from "@/pages/user/UserProfile";
import SubscriptionDetails from "@/pages/agents/SubscriptionDetails";
import SubscriptionPage from "@/pages/agents/SubscriptionPage";
import UpgradeSubscriptionPage from "@/pages/agents/UpgradeSubscriptionPage";
import ChoosePaymentOption from "@/pages/user/ChoosePaymentOption";
import PaymentProcessComfirm from "@/pages/user/PaymentProcessComfirm";
import UserBookingView from "@/pages/user/UserBookingView";

const MainRouts = () => {
  const role = sessionStorage.getItem("role");
  const token = sessionStorage.getItem("token");
  
  return (
    <>
      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
        <NavBar />
      </div>

      {/* CONTENT SHOULD START BELOW NAVBAR */}
      <div className="pt-[60px]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<MainAuth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/agent" element={<SignUp />} />
          <Route path="/agent-registration" element={<AgentRegistration />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/dashboard/search" element={<SearchResults />} />
          <Route path="/package/:id" element={<PackageDetails />} />
          <Route path="/compare" element={<ComparePackages />} />
          <Route path="/payment-option" element={<ChoosePaymentOption />} />
          <Route path="/payment-corfirm" element={<PaymentProcessComfirm />} />

          <Route
            path="/booking-detail"
            element={
              <ProtectedBookFlow>
                <BookingFlow />
              </ProtectedBookFlow>
            }
          />

          <Route
            path="/booking-confirmation"
            element={
              <ProtectedBookFlow>
                <BookingConfirmation />
              </ProtectedBookFlow>
            }
          />

          {/* Role Based */}
          {role === "USER" ? (
            <Route path="/" element={<UserSideBar />}>
              <Route index element={<Home />} />
              <Route path="/customer/search" element={<SearchResults />} />
              <Route
                path="/customer/package/:id"
                element={<PackageDetails />}
              />
              <Route path="/customer/compare" element={<ComparePackages />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="ducoments" element={<DocumentsPage />} />
              <Route path="booking-view" element={<UserBookingView />} />
              <Route path="profiles" element={<UserProfle />} />
              <Route path="analytics" element={<h1>Analytics Page</h1>} />
              <Route path="reviews" element={<ReviewsPage />} />
            </Route>
          ) : role === "AGENT" ? (
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AgentSidebar />
                </ProtectedRoute>
              }
            >
              <Route index element={<Packages />} />
              <Route path="add-package" element={<AddNewPackage />} />
              <Route path="view-package" element={<PackageView />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="bookings-details" element={<BookingDetailsPage />} />
              <Route path="documents" element={<DocumentsAgent />} />
              <Route path="booking-view" element={<BookingViewPage />} />
              <Route path="profiles" element={<ProfilePage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route
                path="subscription-details"
                element={<SubscriptionDetails />}
              />
              <Route
                path="subscription-upgrade"
                element={<UpgradeSubscriptionPage />}
              />
              <Route path="analytics" element={<h1>Analytics Page</h1>} />
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/auth" replace />} />
          )}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default MainRouts;
