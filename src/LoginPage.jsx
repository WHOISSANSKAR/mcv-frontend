// LoginPage.jsx
import React, { useState, useRef, useEffect } from "react";
import "./LoginPage.css";
import {
  FaCloud,
  FaFileAlt,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaCogs,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Cloud Based",
    description:
      "Deployed in a cloud environment, backed up and accessible anytime, anywhere.",
    icon: <FaCloud />,
  },
  {
    title: "Document Management",
    description:
      "Efficient document management module for secure storage, retrieval, and sharing.",
    icon: <FaFileAlt />,
  },
  {
    title: "Analytics",
    description:
      "Gain deep insights through smart analytics and dashboards for decision making.",
    icon: <FaChartLine />,
  },
  {
    title: "Secure",
    description:
      "Enterprise-level security with encryption and compliance to keep your data safe.",
    icon: <FaShieldAlt />,
  },
  {
    title: "Collaboration",
    description:
      "Work seamlessly with your team, clients, and stakeholders in one platform.",
    icon: <FaUsers />,
  },
  {
    title: "Automation",
    description:
      "Automate repetitive tasks and workflows to save time and increase efficiency.",
    icon: <FaCogs />,
  },
];

const LoginPage = ({ setIsLoggedIn }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const navigate = useNavigate();

  const scrollRef = useRef(null);
  const contactRef = useRef(null);
  const aboutCardsRef = useRef(null);

  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => {
    setShowLoginModal(false);
    setLoginError("");
  };

  // Scroll animations
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-element");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.1 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-login if saved
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");
    if (savedLogin === "true") setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  // ✅ UPDATED LOGIN METHOD for new API + your paths
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.trim().length < 8) {
      setLoginError("Password must be at least 8 characters long.");
      setErrorKey((prev) => prev + 1);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/login/", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ required for Flask session cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Invalid email or password");
        setErrorKey((prev) => prev + 1);
        return;
      }
// ✅ SAVE JWT TOKEN
localStorage.setItem("token", data.token);

// ✅ SAVE USER INFO
localStorage.setItem("user", JSON.stringify(data.user));

// ✅ LOGIN FLAG
localStorage.setItem("isLoggedIn", "true");

// ✅ UPDATE APP STATE
setIsLoggedIn(true);

      closeLoginModal();

      // ✅ YOUR CUSTOM PATHS HERE (override backend paths)
      const role = data.user?.usrlst_role?.toLowerCase();

      if (role === "admin") {
        window.location.href = "/dashboard";          // ✅ your admin path
      } else if (role === "user") {
        window.location.href = "/user_dashboard";     // ✅ your user path
      } else {
        setLoginError("Login successful, but role unknown.");
        setErrorKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setLoginError("Something went wrong. Try again.");
      setErrorKey((prev) => prev + 1);
    }
  };

  const scrollToContact = () =>
    contactRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollLeft = () =>
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });

  // Floating cards animation
  useEffect(() => {
    const cards = aboutCardsRef.current?.querySelectorAll(".about-card");
    if (!cards || cards.length === 0) return;
    const section = document.querySelector(".about-us-cards-section");
    const deltaX = [-930, -440, 50];
    const deltaY = 830;
    const initialRotations = [-25, -5, 10];

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;
      const startScroll = sectionTop - viewportHeight;
      const speedFactor = 0.6;
      const endScroll = startScroll + (sectionHeight / 2) * speedFactor;
      let progress = (scrollTop - startScroll) / (endScroll - startScroll);
      progress = Math.min(Math.max(progress, 0), 1);

      cards.forEach((card, index) => {
        card.style.transition = "transform 0.5s ease";
        const rotate = initialRotations[index] * (1 - progress);
        const translateX = deltaX[index] * progress;
        const translateY = deltaY * progress;
        card.style.transform = `translate(${translateX}px, ${translateY}px) scale(1) rotate(${rotate}deg)`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="login-page-container">
      <div className="login-page">
        {/* NAVBAR */}
        <div className="navbar">
          <a href="/" className="brand">
            <img
              src="/logo_white.png"
              alt="MyComplianceView Logo"
              className="logo-img"
            />
          </a>
          <div className="nav-buttons">
            <button className="button contact" onClick={scrollToContact}>
              <span className="button-content">
                <span className="button-text">Request a Demo</span>
                <span className="button-arrow">
                  <FaArrowRight />
                </span>
              </span>
            </button>
            <button className="button" onClick={openLoginModal}>
              <span className="button-content">
                <span className="button-text">Login</span>
                <span className="button-arrow">
                  <FaArrowRight />
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="content">
          <div className="left-section">
            <h1 className="heading scroll-element">
              Integrated Compliance Monitoring
            </h1>
            <p className="sub-heading scroll-element">
              MyComplianceView is a Cloud Based solution to monitor all your
              compliances. These compliances can be Regulatory or Inhouse. It is
              a multi-user solution with multiple levels of approvals and
              escalations. It provides automatic alerts so that no compliance is
              missed.
            </p>
          </div>
          <div className="right-section">
            <div className="image-wrapper">
              <img
                src="/desktop.png"
                alt="Desktop Preview"
                className="desktop-img scroll-element"
              />
              <img
                src="/phone.png"
                alt="Phone Preview"
                className="phone-img scroll-element"
              />
            </div>
          </div>
        </div>

        {/* LOGIN MODAL */}
        {showLoginModal && (
          <div className="modal-overlay" onClick={closeLoginModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <img
                src="/logo_black.png"
                alt="MyComplianceView Logo"
                className="modal-logo"
              />

              {loginError && (
                <div key={errorKey} className="login-error">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <div className="modal-options">
                  <div></div>
                  <a href="#" className="forgot-password">
                    Forgot Password?
                  </a>
                </div>
                <button type="submit" className="submit-button">
                  Submit
                </button>
              </form>
              <button className="close-button" onClick={closeLoginModal}>
                X
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FEATURES */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="scroll-element">Features</h2>
          <div className="feature-arrows">
            <button onClick={scrollLeft} className="arrow-button">
              <FaArrowLeft />
            </button>
            <button onClick={scrollRight} className="arrow-button">
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className="features-scroll-wrapper">
          <div className="features-container" ref={scrollRef}>
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h3 className="scroll-element">{feature.title}</h3>
                  <p className="scroll-element">{feature.description}</p>
                  <a href="#" className="read-more">
                    Learn more <span className="arrow">›</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" style={{ position: "relative" }}>
        <h2 className="about-title scroll-element">Our Services</h2>
        <div className="about-divider"></div>
        <div className="about-box">
          <p className="scroll-element">
            MyComplianceView is a Cloud Based solution to monitor your all
            compliances. These compliances can be Regulatory or Inhouse. It is a
            multi-user solution which has multiple levels of approvals and
            escalations. It provides automatic alerts so that no compliance is
            missed.
          </p>
        </div>

        <div className="floating-about-cards" ref={aboutCardsRef}>
          <div className="about-card">
            <img src="/Lawyer.png" alt="Lawyers" />
            <div className="info-box">
              <h3 className="title">Lawyers</h3>
              <p>
                Legal experts ensuring compliance and smooth documentation for
                your business.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/CA.png" alt="Chartered Accountants" />
            <div className="info-box">
              <h3 className="title">Chartered Accountants</h3>
              <p>
                Certified professionals managing audits, accounts, and financial
                statements.
              </p>
            </div>
          </div>

          <div className="about-card">
            <img src="/engineer.png" alt="Engineers" />
            <div className="info-box">
              <h3 className="title">Engineers</h3>
              <p>
                Technical minds designing, building, and innovating efficient
                solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT US CARDS */}
      <section className="about-us-cards-section">
        <h2 className="about-us-cards-title scroll-element">About Us</h2>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section" ref={contactRef}>
        <h2 className="contact-title scroll-element">Request a demo</h2>
        <div className="contact-divider"></div>
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label
                htmlFor="name"
                className="scroll-element"
                style={{ color: "white" }}
              >
                Your Name
              </label>
              <input type="text" id="name" required className="scroll-element" />
            </div>
            <div className="form-group">
              <label
                htmlFor="email"
                className="scroll-element"
                style={{ color: "white" }}
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                required
                className="scroll-element"
              />
            </div>
            <div className="form-group">
              <label
                htmlFor="phone"
                className="scroll-element"
                style={{ color: "white" }}
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                required
                className="scroll-element"
              />
            </div>
          </div>
          <div className="form-group">
            <label
              htmlFor="message"
              className="scroll-element"
              style={{ color: "white" }}
            >
              Query:
            </label>
            <textarea
              id="message"
              rows="6"
              required
              className="scroll-element"
            ></textarea>
          </div>
          <button type="submit" className="contact-submit scroll-element">
            Get a Callback
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-sections">
            <div className="locations">
              <h4 className="scroll-element">Contact Us</h4>
              <p className="scroll-element">Do you have any questions?</p>
              <button className="footer-button" onClick={scrollToContact}>
                Get in touch
              </button>
            </div>
            <div className="social">
              <h4 className="scroll-element">Social Media</h4>
              <p className="scroll-element">
                Get in touch with us via social media.
              </p>
              <div className="social-icons">
                <a href="#">
                  <FaFacebookF />
                </a>
                <a href="#">
                  <FaInstagram />
                </a>
                <a href="#">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © 2025 MyComplianceView.{" "}
            <a href="https://mycomplianceview.com/tns">Terms of service</a>
          </p>
          <small>
            * We have a team of Lawyers, Chartered Accountants and Technical
            Experts. This team keeps track of the ever-changing Laws and
            Regulations announced by the Government so that you can stay updated
            with compliances.
          </small>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
