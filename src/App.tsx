import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ScrollToTop, BackToTopButton } from "@/components/BackToTop";
import { GlassFilter } from "@/components/ui/liquid-glass";

import Home from "@/pages/Home";
import Tracking from "@/pages/Tracking";
import Quote from "@/pages/Quote";

import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import FirstrankMyChoice from "@/pages/FirstrankMyChoice";
import BusinessSolutions from "@/pages/BusinessSolutions";
import TheFirstrankStore from "@/pages/TheFirstrankStore";
import International from "@/pages/International";
import SchedulePickup from "@/pages/SchedulePickup";
import FileClaim from "@/pages/FileClaim";
import ChangeDelivery from "@/pages/ChangeDelivery";
import Billing from "@/pages/Billing";
import HelpCenter from "@/pages/HelpCenter";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import SharedDashboard from "@/pages/SharedDashboard";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/auth/login">
        <AuthLayout><Login /></AuthLayout>
      </Route>
      <Route path="/auth/signup">
        <AuthLayout><Signup /></AuthLayout>
      </Route>
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/tracking">
        <Layout><Tracking /></Layout>
      </Route>
      <Route path="/shipping/quote">
        <Layout><Quote /></Layout>
      </Route>

      <Route path="/shipping/schedule-pickup">
        <Layout><SchedulePickup /></Layout>
      </Route>
      <Route path="/shipping/international-shipping">
        <Layout><International /></Layout>
      </Route>
      <Route path="/dashboard">
        <DashboardLayout><Dashboard /></DashboardLayout>
      </Route>
      <Route path="/track/firstrank-my-choice">
        <Layout><FirstrankMyChoice /></Layout>
      </Route>
      <Route path="/track/change-delivery">
        <Layout><ChangeDelivery /></Layout>
      </Route>
      <Route path="/business-solutions">
        <Layout><BusinessSolutions /></Layout>
      </Route>
      <Route path="/the-firstrank-store">
        <Layout><TheFirstrankStore /></Layout>
      </Route>
      <Route path="/support/help-center">
        <Layout><HelpCenter /></Layout>
      </Route>
      <Route path="/about">
        <Layout><About /></Layout>
      </Route>
      <Route path="/support/file-a-claim">
        <Layout><FileClaim /></Layout>
      </Route>
      <Route path="/billing">
        <DashboardLayout><Billing /></DashboardLayout>
      </Route>
      <Route path="/admin">
        <AdminLayout><Admin /></AdminLayout>
      </Route>
      <Route path="/shared/:token">
        <SharedDashboard />
      </Route>
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

export default function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      offset: 50,
      duration: 800,
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    <AuthProvider>
      <GlassFilter />
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <ScrollToTop />
        <Router />
        <BackToTopButton />
      </WouterRouter>
    </AuthProvider>
  );
}
