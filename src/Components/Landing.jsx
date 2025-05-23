import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Hero_section_img.jpg";
import about from "../assets/Aboutus_img.jpg";
import cityimg from "../assets/city.png";

function Landing() {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/signup");
    };

    return (
        <div className="bg-gray-50 text-gray-900 font-[Poppins]">
            {/* Navbar */}
            <nav className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
                <div className="text-2xl font-bold text-blue-800">Eventure</div>
                <ul className="flex gap-6">
                    <li>
                        <a href="#about" className="text-gray-800 font-medium hover:text-blue-800 transition">
                            About Us
                        </a>
                    </li>
                    <li>
                        <a href="#how-it-works" className="text-gray-800 font-medium hover:text-blue-800 transition">
                            How It Works
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="text-gray-800 font-medium hover:text-blue-800 transition">
                            Contact Us
                        </a>
                    </li>
                </ul>
                <button
                    onClick={handleSignUp}
                    className="bg-blue-800 text-white py-2 px-6 rounded-md font-semibold text-sm hover:bg-blue-900 transition"
                >
                    Log In / Sign Up
                </button>
            </nav>

            {/* Hero Section */}
            <header className="flex flex-wrap justify-between items-center gap-8 py-12 px-10 bg-blue-100">
                <div className="max-w-lg space-y-4">
                    <h1 className="text-5xl font-bold text-blue-800 leading-snug">
                        Find Sponsors<br />with Ease
                    </h1>
                    <p className="text-lg text-gray-600">
                        Fund your events like never before. Connect with sponsors and unlock growth opportunities effortlessly.
                    </p>
                    <button
                        onClick={handleSignUp}
                        className="bg-blue-800 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-900 transition"
                    >
                        Get Started
                    </button>
                </div>
                <div>
                    <img src={logo} alt="Eventure Hero" className="w-96 rounded-lg shadow-lg" />
                </div>
            </header>

            {/* Features Section */}
            <section className="py-16 px-10 bg-gray-50">
                <h2 className="text-3xl font-bold text-blue-800 text-center mb-12">Key Features</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {[
                        {
                            title: "Find Your Match",
                            description: "Discover sponsors or events tailored to your goals and audience.",
                        },
                        {
                            title: "Simplified Connections",
                            description: "Directly communicate and build relationships on a professional platform.",
                        },
                        {
                            title: "Boost Visibility",
                            description: "Enhance your branding and outreach with the right partnerships.",
                        },
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-6 text-center shadow-lg hover:translate-y-[-4px] transition-transform max-w-xs"
                        >
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-16 px-10 bg-white flex flex-wrap-reverse lg:flex-nowrap items-center gap-12">
                <div className="max-w-lg space-y-4">
                    <h2 className="text-3xl font-bold text-blue-800">About Us</h2>
                    <p className="text-gray-600">
                        At Eventure, we are transforming the landscape of event management by creating a dynamic platform that connects
                        event organizers and sponsors.
                    </p>
                    <p className="text-gray-600">
                        Discover the perfect sponsors who align with your vision and turn your ideas into impactful events.
                    </p>
                </div>
                <div>
                    <img src={about} alt="About Eventure" className="w-full max-w-md rounded-lg shadow-lg" />
                </div>
            </section>

            {/* Why Choose Eventure */}
            <section className="py-16 px-10 bg-gray-50">
                <h2 className="text-3xl font-bold text-blue-800 text-center mb-12">Why Choose Eventure?</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {[
                        {
                            title: "Targeted Connections",
                            description: "No more cold emails; find sponsors and events that truly match your goals.",
                        },
                        {
                            title: "Efficiency",
                            description: "Save time by using smart filters and an intuitive interface.",
                        },
                        {
                            title: "Growth-Focused",
                            description: "Build partnerships that drive branding and visibility.",
                        },
                    ].map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-6 shadow-lg text-center max-w-xs"
                        >
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">{benefit.title}</h3>
                            <p className="text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 px-10 bg-gray-50">
                <h2 className="text-3xl font-bold text-blue-800 text-center mb-12">How It Works</h2>
                <div className="flex flex-wrap justify-center gap-8">
                    {[
                        {
                            title: "Create Your Profile",
                            description: "Set up a professional profile to showcase your goals.",
                        },
                        {
                            title: "Find & Connect",
                            description: "Search for sponsors or events and initiate meaningful connections.",
                        },
                        {
                            title: "Secure Deals",
                            description: "Collaborate effectively and build lasting partnerships.",
                        },
                    ].map((step, index) => (
                        <div
                            key={index}
                            className="bg-blue-50 rounded-lg p-6 shadow-lg text-center max-w-xs"
                        >
                            <h3 className="text-xl font-semibold text-blue-800 mb-4">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Us Section */}
            <section className="py-16 px-10 bg-blue-100 text-center">
                <h1 className="text-5xl font-bold text-blue-800 mb-8">Join Eventure Today!</h1>
                <button
                    onClick={handleSignUp}
                    className="bg-blue-800 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-900 transition"
                >
                    Get Started
                </button>
                <div>
                    <img src={cityimg} alt="City skyline" className="w-96 mx-auto mt-8 rounded-lg" />
                </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact" className="py-16 px-10 bg-gray-50 text-center">
                <h2 className="text-3xl font-bold text-blue-800 mb-8">Contact Us</h2>
                <div className="space-y-4 text-gray-600">
                    <p>Email: support@eventure.com</p>
                    <p>Phone: +1 (123) 456-7890</p>
                    <p>Address: 123 Eventure Lane, Startup City, SC 98765</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-blue-800 text-white py-12">
                <div className="max-w-screen-xl mx-auto flex flex-wrap gap-8 justify-between">
                    <div className="min-w-[200px]">
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">About</a></li>
                            <li><a href="#" className="hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:underline">Press</a></li>
                        </ul>
                    </div>
                    <div className="min-w-[200px]">
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Help Center</a></li>
                            <li><a href="#" className="hover:underline">Terms of Service</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="min-w-[200px]">
                        <h4 className="font-semibold mb-4">Social Media</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">LinkedIn</a></li>
                            <li><a href="#" className="hover:underline">Twitter</a></li>
                            <li><a href="#" className="hover:underline">Facebook</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center mt-8 text-sm">
                    &copy; 2025 Eventure. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default Landing;
