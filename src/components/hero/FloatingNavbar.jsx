"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for hamburger and close

const navItems = [
  "Home",
  "Leaderboard",
  "Contact",
  "FAQ",
  "Idea Box",
  "Contribute",
];

const FloatingNavbar = ({ showLoginState, isLoggedIn: externalLoginState }) => {
  const [hovered, setHovered] = useState("Login");
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const itemRefs = useRef({});
  const router = useRouter();

  useEffect(() => {
    const checkLoginState = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    // Check initial state
    checkLoginState();

    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkLoginState();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleLoginStateChange = () => {
      checkLoginState();
    };

    window.addEventListener("loginStateChanged", handleLoginStateChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("loginStateChanged", handleLoginStateChange);
    };
  }, []);

  // Update login state when external state changes
  useEffect(() => {
    if (externalLoginState !== undefined) {
      setIsLoggedIn(externalLoginState);
    }
  }, [externalLoginState]);

  useEffect(() => {
    if (hovered && itemRefs.current[hovered] && containerRef.current) {
      const item = itemRefs.current[hovered];
      const container = containerRef.current;
      const { left: itemLeft, width } = item.getBoundingClientRect();
      const containerLeft = container.getBoundingClientRect().left;
      setHoverStyle({
        left: itemLeft - containerLeft,
        width,
      });
    }
  }, [hovered]);

  const handleNavigation = (item) => {
    // Close menu on navigation
    setIsMenuOpen(false);

    switch (item) {
      case "Home":
        router.push("/");
        break;
      case "Leaderboard":
        router.push("/leaderboard-contest");
        break;
      case "Contact":
        router.push("/contact");
        break;
      case "FAQ":
        router.push("/faq");
        break;
      case "Idea Box":
        router.push("/ideabox");
        break;
      case "Profile":
        router.push("/profile");
        break;
      case "Contribute":
        window.open("https://github.com/SASTxNST/", "_blank");
        break;
      default:
        break;
    }
  };

  const displayNavItems = [...navItems];
  if (isLoggedIn) {
    displayNavItems.push("Profile");
  } else {
    displayNavItems.push("Login");
  }

  return (
    <>
      {/* Overlay for when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 flex items-center justify-between w-[calc(100%-2rem)] md:w-auto">
        {/* Hamburger Icon for mobile */}
        <div className="md:hidden flex items-center bg-black border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Desktop Navbar / Floating Bar (hidden on mobile when menu icon is shown) */}
        <div
          ref={containerRef}
          className="hidden md:flex relative gap-4 rounded-full border border-white/10 bg-black px-4 py-2 backdrop-blur-md"
        >
          <AnimatePresence>
            <motion.div
              layout
              className={`absolute bottom-1 top-1 rounded-full ${hovered === "Contribute" ? "bg-pink-500/20" : "bg-white/10"
                }`}
              initial={false}
              animate={{
                left: hoverStyle.left,
                width: hoverStyle.width,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </AnimatePresence>

          {displayNavItems.map((item) => (
            <div
              key={item}
              ref={(el) => {
                itemRefs.current[item] = el;
              }}
              onMouseEnter={() => setHovered(item)}
              onFocus={() => setHovered(item)}
              onClick={() => {
                if (item === "Login") {
                  showLoginState?.setShowLoginPopup(true);
                } else {
                  handleNavigation(item);
                }
              }}
              className={`relative z-10 cursor-pointer px-4 py-2 text-sm whitespace-nowrap ${item === "Contribute"
                ? "font-semibold text-pink-400"
                : item === "Profile"
                  ? "font-semibold text-blue-400"
                  : "text-white"
                }`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-full w-64 bg-black/95 backdrop-blur-md z-50 p-6 flex flex-col items-end border-l border-white/10 shadow-lg md:hidden"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white self-end mb-8 focus:outline-none"
              aria-label="Close navigation menu"
            >
              <FaTimes size={24} />
            </button>
            <nav className="flex flex-col gap-6 text-right">
              {displayNavItems.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    if (item === "Login") {
                      showLoginState?.setShowLoginPopup(true);
                      setIsMenuOpen(false); // Close menu after opening login
                    } else {
                      handleNavigation(item);
                    }
                  }}
                  className={`text-lg cursor-pointer py-2 ${item === "Contribute"
                    ? "font-semibold text-pink-400"
                    : item === "Profile"
                      ? "font-semibold text-blue-400"
                      : "text-white hover:text-gray-300"
                    }`}
                >
                  {item}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNavbar;