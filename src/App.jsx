import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import GuestRoute from './components/GuestRoute';

// Pagini Publice
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import CaseStudiesPage from './pages/CaseStudiesPage';

// Pagini Dashboard (pentru utilizatori autentificați)
import DashboardPage from './pages/dashboard/DashboardPage';
import DocumentsPage from './pages/dashboard/DocumentsPage';
import NewDocumentPage from './pages/dashboard/documents/NewDocumentPage';
import TemplatesPage from './pages/dashboard/TemplatesPage';
import AutomationPage from './pages/dashboard/AutomationPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import HelpPage from './pages/dashboard/HelpPage';
import QuickGuidePage from './pages/dashboard/help/QuickGuidePage';
import VideoTutorialsPage from './pages/dashboard/help/VideoTutorialsPage';
import BillingPage from './pages/dashboard/help/BillingPage';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Routes>
          {/* Rute protejate pentru dashboard */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/documents"
            element={
              <RequireAuth>
                <DocumentsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/documents/new"
            element={
              <RequireAuth>
                <NewDocumentPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/templates"
            element={
              <RequireAuth>
                <TemplatesPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/automation"
            element={
              <RequireAuth>
                <AutomationPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <RequireAuth>
                <ReportsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <RequireAuth>
                <SettingsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/help"
            element={
              <RequireAuth>
                <HelpPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/help/quick-guide"
            element={
              <RequireAuth>
                <QuickGuidePage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/help/video-tutorials"
            element={
              <RequireAuth>
                <VideoTutorialsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard/help/billing"
            element={
              <RequireAuth>
                <BillingPage />
              </RequireAuth>
            }
          />

          {/* Rute publice */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <GuestRoute>
                          <HomePage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/features"
                      element={
                        <GuestRoute>
                          <FeaturesPage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/pricing"
                      element={
                        <GuestRoute>
                          <PricingPage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/about"
                      element={
                        <GuestRoute>
                          <AboutPage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/contact"
                      element={
                        <GuestRoute>
                          <ContactPage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <GuestRoute>
                          <SignUpPage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <GuestRoute>
                          <LoginPage />
                        </GuestRoute>
                      }
                    />
                    <Route
                      path="/case-studies"
                      element={
                        <GuestRoute>
                          <CaseStudiesPage />
                        </GuestRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;
