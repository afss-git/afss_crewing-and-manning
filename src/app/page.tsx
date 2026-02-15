"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-solid border-b-[#e6d1d1] dark:border-b-[#4a0b0c] bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-sm px-6 py-4 lg:px-20">
        <div className="flex items-center gap-4 text-primary dark:text-white">
          <div className="size-8 flex items-center justify-center rounded bg-primary text-white">
            <span className="material-symbols-outlined text-xl">anchor</span>
          </div>
          <h2 className="text-[#1b0e0e] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
            CrewManning
          </h2>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-8">
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#services"
            >
              Services
            </a>
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#register"
            >
              Register
            </a>
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#contact"
            >
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              className="text-primary dark:text-red-300 text-sm font-bold leading-normal hover:underline"
              href="/login"
            >
              Login
            </Link>
            <Link
              href="#register"
              className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Get Started</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-[#1b0e0e] dark:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined cursor-pointer text-2xl">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </header>

      {/* Mobile Menu - Slide Down */}
      {isMenuOpen && (
        <div className="lg:hidden bg-surface-light dark:bg-surface-dark border-b border-[#e6d1d1] dark:border-[#4a0b0c] px-6 py-4 animate-fade-in">
          <nav className="flex flex-col gap-4">
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-base font-medium hover:text-primary transition-colors py-2"
              href="#services"
              onClick={toggleMenu}
            >
              Services
            </a>
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-base font-medium hover:text-primary transition-colors py-2"
              href="#register"
              onClick={toggleMenu}
            >
              Register
            </a>
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-base font-medium hover:text-primary transition-colors py-2"
              href="#contact"
              onClick={toggleMenu}
            >
              Contact
            </a>
            <div className="pt-4 border-t border-[#e6d1d1] dark:border-[#4a0b0c]">
              <Link
                className="block text-center text-primary dark:text-red-300 text-base font-bold leading-normal py-2"
                href="/login"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                href="#register"
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary hover:bg-primary-dark transition-colors text-white text-base font-bold leading-normal tracking-[0.015em] mt-2"
                onClick={toggleMenu}
              >
                <span className="truncate">Get Started</span>
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center w-full bg-background-light dark:bg-background-dark pt-8 pb-8">
        <div className="w-full max-w-[1440px] px-4 md:px-10 lg:px-20">
          <div className="relative w-full rounded-xl overflow-hidden min-h-[400px] md:min-h-[480px] lg:min-h-[520px] flex items-center justify-center">
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNrU1H6fw7drcarA6pQN7vgsQ-92GZtRxgksidhazN0j36oa0WPQ7QxXWB5OJZ2w78BR3dWZClMGeH-CLZtgwHg4NfTmSfCzIcgZA-e8fPYjJxZbkFqNnemnSthr16g1iM8mH7BypOYUpg28Q3qfR-7K3-5yt-aoa24tQdmD7kaMAhyFxlijsFWHhJh1jIoG8AjCbpW5Zqq90gXWI9dWpbqgFgbtvYqx9_lJvL6ozhncR_YwmrzaUx5DcTICUSqNLsWQ5Uv6K46fVj')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-[#211112cc] z-10" />
            <div className="relative z-20 flex flex-col gap-6 items-start max-w-2xl p-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md w-fit">
                <span className="size-2 rounded-full bg-green-400"></span>
                Live Crewing Availability
              </div>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
                Precision Crewing for Maritime Operations
              </h1>
              <h2 className="text-gray-200 text-lg md:text-xl font-normal leading-relaxed max-w-lg">
                Delivering professional crewing and manning solutions by
                connecting skilled seafarers with leading ship owners globally.
                Efficient operations. Full compliance. Trusted performance.
              </h2>
              <div className="mt-4 flex flex-wrap gap-4 w-full max-w-lg">
                <Link
                  href="/register/seafarer"
                  className="flex flex-1 min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-primary-dark text-white text-base font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    person
                  </span>
                  I am a Seafarer
                </Link>
                <Link
                  href="/register/shipowner"
                  className="flex flex-1 min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white hover:bg-gray-100 text-primary text-base font-bold transition-all shadow-lg border border-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    sailing
                  </span>
                  I am a Ship Owner
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 px-6 lg:px-20 bg-background-light dark:bg-background-dark"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4 text-center md:text-left">
              <h2 className="text-[#1b0e0e] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em]">
                Tailored Maritime Solutions
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-normal max-w-2xl">
                Whether you need a single officer for a specific voyage or
                complete fleet management, our platform scales with your
                operational needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 - One-Off Crew Supply */}
              <div className="group flex flex-col gap-6 rounded-xl border border-[#e6d1d1] dark:border-[#4a0b0c] bg-surface-light dark:bg-surface-dark p-8 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    person_add
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#1b0e0e] dark:text-white text-2xl font-bold leading-tight">
                    One-Off Crew Supply
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    Rapid deployment for immediate vacancies. We maintain a
                    verified pool of ready-to-board seafarers to ensure your
                    operations never stop due to staffing shortages.
                  </p>
                  <ul className="mt-2 flex flex-col gap-2 text-sm text-[#5c3a3a] dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">
                        check_circle
                      </span>
                      Vetted certifications
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">
                        check_circle
                      </span>
                      Short-notice availability
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">
                        check_circle
                      </span>
                      24/7 support
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2 - Full Crew Management */}
              <div className="group flex flex-col gap-6 rounded-xl border border-[#e6d1d1] dark:border-[#4a0b0c] bg-surface-light dark:bg-surface-dark p-8 shadow-sm transition-all hover:border-primary hover:shadow-md">
                <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-3xl">
                    manage_accounts
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-[#1b0e0e] dark:text-white text-2xl font-bold leading-tight">
                    Full Crew Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                    End-to-end HR, payroll, training, and compliance solutions
                    for your entire fleet. We act as your extended HR
                    department, handling the complexities of maritime labor.
                  </p>
                  <ul className="mt-2 flex flex-col gap-2 text-sm text-[#5c3a3a] dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">
                        check_circle
                      </span>
                      Payroll & tax handling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">
                        check_circle
                      </span>
                      Training & career development
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-sm">
                        check_circle
                      </span>
                      Regulatory compliance
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-20 bg-gradient-to-br from-primary/5 to-white dark:from-primary/10 dark:to-surface-dark">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10,000+", label: "Seafarers Registered" },
              { number: "500+", label: "Ship Owners" },
              { number: "40+", label: "Countries Served" },
              { number: "98%", label: "Success Rate" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-4xl font-black text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Break */}
      <section className="w-full h-64 md:h-80 lg:h-96 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/40 z-10"></div>
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581094794323-8f4f69156506?w=1200&h=600&fit=crop')",
          }}
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-2">
              Global Reach, Local Expertise
            </h2>
            <p className="text-white/90 text-lg">
              Operating in 40+ major ports worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-20 bg-background-light dark:bg-background-dark">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-[#1b0e0e] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em] mb-4">
              Why Choose CrewManning?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with deep maritime industry
              expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "verified",
                title: "Verified Profiles",
                description:
                  "Every seafarer undergoes rigorous background checks and document verification.",
              },
              {
                icon: "speed",
                title: "Rapid Deployment",
                description:
                  "Find and onboard qualified crew within 24-48 hours for urgent requirements.",
              },
              {
                icon: "security",
                title: "Compliance Guaranteed",
                description:
                  "Stay compliant with international maritime regulations and standards.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-surface-light dark:bg-surface-dark p-8 rounded-xl border border-[#e6d1d1] dark:border-[#4a0b0c] text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-[#1b0e0e] dark:text-white text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Pathways Section */}
      <section
        id="register"
        className="py-20 px-6 lg:px-20 bg-surface-light dark:bg-surface-dark"
      >
        <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-background-light to-[#f3e8e8] dark:from-[#2a1718] dark:to-surface-dark border border-[#e6d1d1] dark:border-[#4a0b0c] p-8 md:p-12 shadow-sm">
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col gap-3">
              <h2 className="text-[#1b0e0e] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em]">
                Ready to get started?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg font-normal leading-normal max-w-xl mx-auto">
                Join the CrewManning platform today. Choose your path below to
                access our network.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl justify-center">
              <div className="flex-1 flex flex-col gap-4 items-center p-6 rounded-xl bg-white dark:bg-background-dark shadow-sm border border-transparent hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-4xl text-primary">
                  badge
                </span>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#1b0e0e] dark:text-white">
                    For Seafarers
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Find your next contract
                  </p>
                </div>
                <Link
                  href="/register/seafarer"
                  className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold tracking-[0.015em] transition-colors"
                >
                  Register as Seafarer
                </Link>
              </div>
              <div className="flex-1 flex flex-col gap-4 items-center p-6 rounded-xl bg-white dark:bg-background-dark shadow-sm border border-transparent hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-4xl text-primary">
                  apartment
                </span>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#1b0e0e] dark:text-white">
                    For Ship Owners
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Staff your vessels
                  </p>
                </div>
                <Link
                  href="/register/shipowner"
                  className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-sm font-bold tracking-[0.015em] transition-colors"
                >
                  Register as Ship Owner
                </Link>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                className="text-primary font-bold hover:underline"
                href="/login"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 lg:px-20 bg-gradient-to-br from-white to-[#f9f5f5] dark:from-surface-dark dark:to-[#1a0f10]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-[#1b0e0e] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.02em] mb-4">
              What Our Users Say
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Join thousands of satisfied seafarers and ship owners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Captain John Smith",
                role: "Master Mariner",
                content:
                  "CrewManning revolutionized how I find qualified crew. The verification system saved me countless hours.",
                rating: 5,
              },
              {
                name: "Sarah Williams",
                role: "Fleet Manager",
                content:
                  "Managing 15 vessels was a nightmare before CrewManning. Now I can track all deployments from one dashboard.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Chief Engineer",
                content:
                  "Found my dream position in just 2 weeks! The platform made document management and applications so easy.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-surface-dark p-8 rounded-xl border border-[#e6d1d1] dark:border-[#4a0b0c] shadow-sm"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-yellow-400 text-lg"
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-[#1b0e0e] dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-primary text-white pt-16 pb-8">
        <div className="px-6 lg:px-20 max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="size-6 flex items-center justify-center rounded bg-white text-primary">
                  <span className="material-symbols-outlined text-sm">
                    anchor
                  </span>
                </div>
                <h3 className="text-lg font-bold">CrewManning</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                The premier digital platform for maritime crewing solutions.
                Connecting the world&apos;s oceans through verified talent.
              </p>
              <div className="flex gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {i === 1
                        ? "facebook"
                        : i === 2
                          ? "twitter"
                          : i === 3
                            ? "linkedin"
                            : "instagram"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li>
                  <Link
                    href="/register/seafarer"
                    className="hover:text-white hover:underline"
                  >
                    Seafarer Registration
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register/shipowner"
                    className="hover:text-white hover:underline"
                  >
                    Ship Owner Registration
                  </Link>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    News & Blog
                  </a>
                </li>
                <li>
                  <a className="hover:text-white hover:underline" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="flex flex-col gap-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">
                    mail
                  </span>
                  <span>info@allfreightsupportservices.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">
                    call
                  </span>
                  <span>+234 706 651 1103</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-base mt-0.5">
                    location_on
                  </span>
                  <span>6A Hinderer Road, Apapa G.R.A, Lagos, Nigeria</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
            <p>
              © {new Date().getFullYear()} CrewManning Platform. All rights
              reserved.
            </p>
            <div className="flex gap-6">
              <a className="hover:text-white" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-white" href="#">
                Terms of Service
              </a>
              <a className="hover:text-white" href="#">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
