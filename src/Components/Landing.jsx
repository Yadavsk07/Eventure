import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";
import logo from "../assets/Hero_section_img.jpg";
import about from "../assets/Aboutus_img.jpg";
import cityimg from "../assets/city.png";

function Landing() {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="body">
            {/* Navbar */}
            <nav className="navbar">
                <div className="logo">Eventure</div>
                <ul className="nav-links">
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#contact">Contact Us</a></li>
                </ul>
                <button className="login-button" onClick={handleSignUp}>
                    Log In / Sign Up
                </button>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <div className="container">
                    <h1>
                        Find Sponsors<br />with Ease
                    </h1>
                    <p>
                        Fund your events like never before. Connect with sponsors and unlock growth opportunities effortlessly.
                    </p>
                    <button className="get-started" onClick={handleSignUp}>
                        Get Started
                    </button>
                </div>
                <div className="image-container">
                    <img src={logo} alt="Eventure graphic" />
                </div>
            </header>

            {/* Features Section */}
            <section className="features">
                <h2>Key Features</h2>
                <div className="container-2">
                    <div className="box">
                        <h3>Find Your Match</h3>
                        <p>Discover sponsors or events tailored to your goals and audience.</p>
                    </div>
                    <div className="box">
                        <h3>Simplified Connections</h3>
                        <p>Directly communicate and build relationships on a professional platform.</p>
                    </div>
                    <div className="box">
                        <h3>Boost Visibility</h3>
                        <p>Enhance your branding and outreach with the right partnerships.</p>
                    </div>
                </div>
            </section>

            {/* About Us */}
            <section className="about-us" id="about">
                <div className="container">
                    <h2>About Us</h2>
                    <p>
                        At Eventure, we are transforming the landscape of event management by creating a dynamic platform that connects
                        event organizers and sponsors. Our mission is to bridge the gap between these two vital players, fostering
                        collaboration and driving mutual growth.
                    </p>
                    <p>
                        For event organizers, Eventure provides the tools and opportunities to discover the perfect sponsors who align
                        with your vision, helping you turn your ideas into impactful and memorable events.
                    </p>
                    <p>
                        For sponsors, our platform offers unparalleled access to events that resonate with your brand and audience,
                        enabling you to maximize visibility and achieve your marketing goals.
                    </p>
                    <p>
                        Eventure is more than just a platform; it’s a partnership hub. We simplify the process of finding and forming
                        meaningful collaborations, ensuring both organizers and sponsors can focus on what truly matters: creating
                        experiences that inspire, engage, and leave a lasting impact.
                    </p>
                </div>
                <div className="img-container">
                    <img src={about} alt="Teamwork illustration representing Eventure's mission" />
                </div>
            </section>

            {/* Why Choose Eventure */}
            <section className="choose-eventure">
                <h2>Why Choose Eventure?</h2>
                <div className="container-2">
                    <div className="box">
                        <h3>Targeted Connections</h3>
                        <p>No more cold emails; find sponsors and events that truly match your goals.</p>
                    </div>
                    <div className="box">
                        <h3>Efficiency</h3>
                        <p>Save time by using smart filters and an intuitive interface.</p>
                    </div>
                    <div className="box">
                        <h3>Growth-Focused</h3>
                        <p>Build partnerships that drive branding and visibility.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works" id="how-it-works">
                <h2>How It Works</h2>
                <div className="container-2">
                    <div className="box">
                        <h3>Create Your Profile</h3>
                        <p>Set up a professional profile to showcase your goals.</p>
                    </div>
                    <div className="box">
                        <h3>Find & Connect</h3>
                        <p>Search for sponsors or events and initiate meaningful connections.</p>
                    </div>
                    <div className="box">
                        <h3>Secure Deals</h3>
                        <p>Collaborate effectively and build lasting partnerships.</p>
                    </div>
                </div>
            </section>

            {/* Join Section */}
            <section className="join">
                <h1>Join Eventure Today!</h1>
                <button className="join-button" onClick={handleSignUp}>
                    Get Started
                </button>
                <div className="image">
                    <img src={cityimg} alt="City skyline illustration" />
                </div>
            </section>

            {/* Contact Us */}
            <section className="contact" id="contact">
                <h2>Contact Us</h2>
                <div className="details">
                    <p>Email: support@eventure.com</p>
                    <p>Phone: +1 (123) 456-7890</p>
                    <p>Address: 123 Eventure Lane, Startup City, SC 98765</p>
                </div>
                <div className="form">
                    <form>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="Your Message" rows="5" required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h4>Social Media</h4>
                        <ul>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">Facebook</a></li>
                        </ul>
                    </div>
                </div>
                <div className="legal">
                    &copy; 2025 Eventure. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Landing;
