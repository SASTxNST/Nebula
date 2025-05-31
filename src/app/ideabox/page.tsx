"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const IdeaForm = () => {
  const [idea, setIdea] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const mailIconRef = useRef<HTMLSpanElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      opacity: 0,
      y: 60,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  const triggerConfetti = () => {
    if (!confettiRef.current) return;

    for (let i = 0; i < 40; i++) {
      const flake = document.createElement("div");
      flake.className = "flake";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
      confettiRef.current.appendChild(flake);

      gsap.to(flake, {
        y: "100vh",
        x: `${Math.random() * 200 - 100}px`,
        rotation: Math.random() * 720,
        duration: 2 + Math.random(),
        ease: "power2.out",
        onComplete: () => flake.remove(),
      });
    }
  };

  // Animate mail icon flying up inside the button
  const animateMailIcon = () => {
    if (!mailIconRef.current) return;

    gsap.set(mailIconRef.current, {
      y: 0,
      opacity: 1,
      scale: 1,
      display: "inline-block",
    });

    gsap.to(mailIconRef.current, {
      y: -40,
      opacity: 0,
      scale: 0.5,
      duration: 1,
      ease: "power1.out",
      onComplete: () => {
        if (mailIconRef.current) {
          mailIconRef.current.style.display = "none";
        }
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(155,89,182,0.7) 0%, transparent 70%)",
          filter: "blur(80px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "10%",
          width: "250px",
          height: "250px",
          background:
            "radial-gradient(circle, rgba(255,0,122,0.7) 0%, transparent 70%)",
          filter: "blur(100px)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "15%",
          width: "120px",
          height: "120px",
          background:
            "radial-gradient(circle, rgba(255,255,0,0.7) 0%, transparent 70%)",
          filter: "blur(60px)",
          zIndex: 1,
        }}
      />

      <div
        ref={confettiRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{
          background:
            "linear-gradient(90deg,rgba(22, 48, 115, 0.3) 13%, rgba(71, 11, 39, 0.1) 100%)",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          zIndex: 20,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.75rem",
            color: "#00bfff",
            letterSpacing: "1px",
          }}
        >
          Submit Your Idea
        </h2>

        <textarea
          placeholder="Your idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          required
          rows={5}
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "#fff",
            fontWeight: "normal",
            fontFamily: "inherit",
          }}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "0.75rem",
            borderRadius: "8px",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "#fff",
            fontWeight: "normal",
            fontFamily: "inherit",
          }}
        />
        <button
          ref={submitButtonRef}
          type="submit"
          style={{
            position: "relative",
            padding: "0.75rem",
            background: "linear-gradient(to right, #00b894, #00cec9)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "normal",
            fontFamily: "inherit",
            transition: "all 0.3s ease",
            overflow: "visible",
          }}
        >
          🚀 Submit Idea
          <span
            ref={mailIconRef}
            style={{
              display: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "18px",
              height: "18px",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#fff"
              viewBox="0 0 24 24"
              width="18"
              height="18"
            >
              <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0v.01L12 13l8-6.99V6H4zm16 2.08L13.28 13 18 16.92V8.08z" />
            </svg>
          </span>
        </button>
        <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{status}</p>
      </form>

      <style>
        {`
          .flake {
            position: absolute;
            top: 0;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            opacity: 0.9;
            pointer-events: none;
            z-index: 9999;
          }
        `}
      </style>
    </div>
  );
};

export default IdeaForm;
