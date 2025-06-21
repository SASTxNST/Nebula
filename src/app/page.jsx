"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FloatingNavbar from "@/components/hero/FloatingNavbar";
import NebulaHero from "@/components/NebulaHero";
import About from "@/components/hero/About";
import GitHubShowcase from "@/components/hero/GitHubShowcase";
import AutoScrollingTestimonials from "@/components/hero/AutoScrollingTestimonal";
import VisualDiary from "@/components/hero/VisualDiary";
import EventsSection from "@/components/hero/EventsSection";
import TeamPage from "@/components/hero/TeamPage";
import LoginFormPopup from "@/components/LoginFormPopup";
import Footer from "@/components/hero/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setIsClient(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showLoginPopup ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showLoginPopup]);

  if (!isClient) return null;

  return (
    <>
      <FloatingNavbar showLoginState={{ setShowLoginPopup }} isLoggedIn={isLoggedIn} />

      <div className="snap-container">
        <section className="snap-section">
          <NebulaHero />
        </section>

        <section className="snap-section">
          <About />
        </section>

        <section className="snap-section">
          <GitHubShowcase />
        </section>

        <section className="snap-section">
          <AutoScrollingTestimonials />
        </section>

        <section className="snap-section">
          <VisualDiary />
        </section>

        <section className="snap-section">
          <EventsSection />
        </section>

        <section className="snap-section">
          <TeamPage />
          <Footer />
        </section>
      </div>

      {showLoginPopup && (
        <LoginFormPopup
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={(token, email) => {
            setIsLoggedIn(true);
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            setShowLoginPopup(false);
            // Dispatch custom event to notify navbar
            window.dispatchEvent(new Event("loginStateChanged"));
            router.push("/profile");
          }}
        />
      )}

      <style jsx global>{`
        .snap-container {
          height: 100vh;
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        .snap-section {
          min-height: 100vh;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          position: relative;
        }

        /* Optional: Add smooth transitions */
        .snap-section {
          transition: transform 0.3s ease-in-out;
        }

        /* Disable scroll snap on mobile for better UX */
        @media (max-width: 768px) {
          .snap-container {
            scroll-snap-type: none;
          }
          
          .snap-section {
            scroll-snap-align: none;
            scroll-snap-stop: normal;
          }
        }

        /* Hide scrollbar but keep functionality */
        .snap-container::-webkit-scrollbar {
          display: none;
        }
        
        .snap-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

export default Page;