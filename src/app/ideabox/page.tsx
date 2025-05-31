"use client";

import React, { useEffect, useRef, useState } from "react";

const IdeaForm = () => {
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const formRef = useRef(null);
  const confettiRef = useRef(null);
  const mailIconRef = useRef(null);
  const submitButtonRef = useRef(null);

  useEffect(() => {

    if (formRef.current) {
      formRef.current.style.opacity = "0";
      formRef.current.style.transform = "translateY(30px)";

      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.transition = "all 0.8s ease-out";
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }
  }, []);

  const triggerConfetti = () => {
    if (!confettiRef.current) return;

    for (let i = 0; i < 30; i++) {
      const flake = document.createElement("div");
      flake.className = "flake";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.background = `hsl(${280 + Math.random() * 40}, 70%, 60%)`;
      confettiRef.current.appendChild(flake);

      // Simple animation without gsap
      flake.style.transition = `all ${2 + Math.random()}s ease-out`;
      flake.style.transform = `translateY(100vh) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg)`;
      flake.style.opacity = "0";

      setTimeout(() => flake.remove(), 3000);
    }
  };

  const animateMailIcon = () => {
    if (!mailIconRef.current) return;

    mailIconRef.current.style.display = "inline-block";
    mailIconRef.current.style.transition = "all 1s ease-out";
    mailIconRef.current.style.transform = "translateY(-40px)";
    mailIconRef.current.style.opacity = "0";

    setTimeout(() => {
      if (mailIconRef.current) {
        mailIconRef.current.style.display = "none";
        mailIconRef.current.style.transform = "translateY(0)";
        mailIconRef.current.style.opacity = "1";
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: "98fb747b-5563-4c3c-8b9c-7bf696198d88",
        subject: "New Idea Submission",
        email,
        idea,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setStatus("Sent! ✅");
      setIdea("");
      setEmail("");
      triggerConfetti();
      animateMailIcon();
    } else {
      setStatus("Failed to send ❌");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center p-8 relative overflow-hidden"
      style={{ backgroundColor: "#0f0f23" }}
    >

      <div
        className="absolute top-20 right-0 w-80 h-96 opacity-40"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          clipPath: "polygon(100% 0%, 100% 100%, 0% 100%)",
          transform: "translateX(20%)",
        }}
      />

      <div
        className="absolute bottom-10 left-0 w-60 h-60 opacity-30"
        style={{
          background: "linear-gradient(45deg, #7c3aed 0%, #a855f7 100%)",
          clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
          transform: "translateX(-30%)",
        }}
      />


      <div
        ref={confettiRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1000 }}
      />


      <div
        ref={formRef}
        className="rounded-3xl shadow-2xl p-8 max-w-md w-full relative"
        style={{
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)",
          boxShadow:
            "0 25px 50px -12px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(139, 92, 246, 0.2)",
          zIndex: 10,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >

        <div
          className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-6"
          style={{
            backgroundColor: "rgba(139, 92, 246, 0.2)",
            color: "#c084fc",
            letterSpacing: "0.05em",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          }}
        >
          SUBMIT
        </div>

        {/* Title */}
        <h1
          className="text-3xl font-bold mb-4"
          style={{
            color: "#f8fafc",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Share Your Idea
        </h1>


        <p
          className="mb-8 leading-relaxed"
          style={{
            color: "#cbd5e1",
            fontSize: "16px",
            lineHeight: "1.6",
          }}
        >
          Have a brilliant idea? We'd love to hear from you. Share your thoughts
          and let's make something amazing together.
        </p>


        <div className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#f1f5f9",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Your Idea
            </label>
            <textarea
              placeholder="Describe your innovative idea..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl transition-all duration-200 resize-none"
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                color: "#f8fafc",
                fontSize: "16px",
                fontFamily: "inherit",
                lineHeight: "1.5",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#f1f5f9",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                color: "#f8fafc",
                fontSize: "16px",
                fontFamily: "inherit",
                lineHeight: "1.5",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#8b5cf6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
          </div>

          <button
            ref={submitButtonRef}
            onClick={handleSubmit}
            className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              fontSize: "16px",
              boxShadow: "0 8px 32px rgba(139, 92, 246, 0.3)",
              fontFamily: "inherit",
              fontWeight: "600",
              letterSpacing: "0.025em",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              Submit Idea
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </span>

            <span
              ref={mailIconRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
          </button>

          {status && (
            <p
              className="text-center text-sm font-medium"
              style={{
                color: status.includes("✅")
                  ? "#059669"
                  : status.includes("❌")
                    ? "#dc2626"
                    : "#6b7280",
              }}
            >
              {status}
            </p>
          )}
        </div>


        <div className="mt-8 pt-6" style={{ borderTop: "1px solid #334155" }}>
          <a
            href="#"
            className="font-medium hover:text-purple-400 transition-colors duration-200 flex items-center gap-2"
            style={{ color: "#a855f7" }}
          >
            Learn more
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        .flake {
          position: absolute;
          top: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          opacity: 0.8;
          pointer-events: none;
          z-index: 999;
        }
      `}</style>
    </div>
  );
};

export default IdeaForm;
