import Link from "next/link";

export default function Home() {
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
              href="#"
            >
              About
            </a>
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#"
            >
              Services
            </a>
            <a
              className="text-[#1b0e0e] dark:text-gray-200 text-sm font-medium hover:text-primary transition-colors"
              href="#"
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
        {/* Mobile Menu Icon */}
        <div className="lg:hidden text-[#1b0e0e] dark:text-white">
          <span className="material-symbols-outlined cursor-pointer">menu</span>
        </div>
      </header>
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
                <a
                  href="/register/seafarer"
                  className="flex flex-1 min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-primary-dark text-white text-base font-bold transition-all shadow-lg hover:shadow-xl"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    person
                  </span>
                  I am a Seafarer
                </a>
                <a
                  href="/register/shipowner"
                  className="flex flex-1 min-w-[160px] cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-white hover:bg-gray-100 text-primary text-base font-bold transition-all shadow-lg border border-primary"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    sailing
                  </span>
                  I am a Ship Owner
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6 lg:px-20 bg-background-light dark:bg-background-dark">
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
              {/* Card 1 */}
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
                  </ul>
                </div>
              </div>
              {/* Card 2 */}
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
                  </ul>
                </div>
              </div>
            </div>
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
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUtNCikXXf5pp4sQ-g_qxiOj_zI6Tz9y7SpoRAUlRI_8poz9vLrLI3iOr1JEi8vnv8K7WNlSwjEL27S7bXHwQlvGU-37Wx686OWoYhjOJNS00wnBCEoy-wJAWxg_NL_D3c1sAbjBfjlQSWks7EwSwNjcVENrYjPgnA4Hij5_fmGg2Q_6eDf6E_dIL-EbINpDnQsMLLiai9L3RKd6Nobp6x-VP_yFD1CyKo-S3Zzn694Dxk9d38LMiMMKM91Vpch48mPlx281aBTfAG')",
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
                <a
                  href="/register/seafarer"
                  className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold tracking-[0.015em] transition-colors"
                >
                  Register as Seafarer
                </a>
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
                <a
                  href="/register/shipowner"
                  className="w-full flex items-center justify-center rounded-lg h-12 px-5 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white text-sm font-bold tracking-[0.015em] transition-colors"
                >
                  Register as Ship Owner
                </a>
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
      {/* Footer */}
      <footer className="bg-primary text-white pt-16 pb-8">
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
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li>
                  <a
                    href="/register/seafarer"
                    className="hover:text-white hover:underline"
                  >
                    Seafarer Registration
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-white hover:underline"
                    href="/register/shipowner"
                  >
                    Ship Owner Registration
                  </a>
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
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">
                    mail
                  </span>{" "}
                  info@allfreightsupportservices.com
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">
                    call
                  </span>{" "}
                  +2347066511103
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs">
                    location_on
                  </span>{" "}
                  6A Hinderer Road Apapa G.R.A, Lagos, Nigeria
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
