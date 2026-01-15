"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Document {
  name: string;
  status: "approved" | "pending" | "incomplete";
  exp?: string;
  uploaded?: string;
}

interface Applicant {
  name: string;
  role: string;
  country: string;
  flag: string;
  applied: string;
  avatar: string;
  status: string;
  statusType: "warning" | "neutral" | "success";
  experience: string;
  email: string;
  phone: string;
  progress: number;
  documents: Document[];
}

export default function AdminSeafarersPage() {
  const router = useRouter();
  const [selectedApplicant, setSelectedApplicant] = useState(0);
  const [activeTab, setActiveTab] = useState<"new" | "verified">("new");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [interviewer, setInterviewer] = useState(
    "Capt. John Smith (Superintendent)"
  );
  const [meetingLink, setMeetingLink] = useState("");

  const applicants: Applicant[] = [
    {
      name: "Alexios Papadopoulos",
      role: "Chief Engineer",
      country: "Greece",
      flag: "Greece",
      applied: "2 days ago",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXcWA7iOmoIBN-4UfLJdNYpc7ic8w_NY-8K98kOJZsEuMny-DHU-152v-qjnaxnJPwLEQ2onXkcbxiJeilFBR8-kw5GgbPUjIHrxsHJU1LmcAIvRzWkAqD2BU_xl_mhfIF3f3H0X9on_UxzViG6oOVph0e1AaCm2iMuPsszfVq_sy4i79KQf14x5Bkn3AfJ_Z6AsnflJJ6UNJPzCFQ7qBFmqUuaTn658I-me2-ZyLN4pgngNAKoFw6-uKr68nYpu93tD5PjKWTHGnW",
      status: "Docs Review",
      statusType: "warning",
      experience: "12 Years Experience",
      email: "alexios.p@email.com",
      phone: "+30 69 1234 5678",
      progress: 60,
      documents: [
        { name: "Passport", status: "approved", exp: "12 Oct 2028" },
        { name: "Seaman's Book", status: "pending", uploaded: "yesterday" },
        {
          name: "Medical Certificate",
          status: "pending",
          uploaded: "2 days ago",
        },
      ],
    },
    {
      name: "Sarah Jenkins",
      role: "2nd Officer",
      country: "UK",
      flag: "UK",
      applied: "3 days ago",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhP9E4338osd5dcuAJXfK3eA60PUs0lZX9CotZDRRYPNW21b0v9317wHmMykHrrJyf_3E0USNCmxA91zAZyrLMsXjop-VXGn-Phs_x1MPKuQdChWseTx250STNbp_ugVFdORMeGnn1I3FNfu3iNeCOYFul011Mly2FWEwSlj4AXMdH40jf_dW1J9NUEeQygBeENeiWtuEw4EpAYTrwhgnZdcF__Ip8aONe5AvaZxSV2nlWivw1RYgzZ3-2OGld21qpZlPFKflJCx8r",
      status: "Incomplete",
      statusType: "neutral",
      experience: "6 Years Experience",
      email: "sarah.j@email.com",
      phone: "+44 20 1234 5678",
      progress: 40,
      documents: [
        { name: "Passport", status: "approved", exp: "10 Jan 2029" },
        { name: "Seaman's Book", status: "incomplete", uploaded: "yesterday" },
      ],
    },
    {
      name: "Miguel Santos",
      role: "Cook",
      country: "Philippines",
      flag: "Philippines",
      applied: "5 days ago",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBssASONYTuYKclKZIok4KBusAsP0rCvcVlTqxi8kOLFrWlnoTix7HAo9v4JH0p_CB-vV0Gi2l1xfdDbG39UZWXLxWPM4eHo0YCPbt_ImG2uNZAhaqsmx_FAXC43k8rcIrUdlTZO4JtCrH5mUIaFRCV1RzeZGe6yhNtTtl-SYf0Cb9RbJqfK7qMVts4EIaQ42PVUdeaB41mot8-RoXjsIIQ5KIj9hVgh0vADOihvTru65lcrkTo3auHlYjA14DWSzxZdjsum-uc85VN",
      status: "Interview Ready",
      statusType: "success",
      experience: "8 Years Experience",
      email: "miguel.s@email.com",
      phone: "+63 91 1234 5678",
      progress: 80,
      documents: [
        { name: "Passport", status: "approved", exp: "15 Mar 2027" },
        { name: "Seaman's Book", status: "approved", uploaded: "1 week ago" },
        {
          name: "Medical Certificate",
          status: "approved",
          uploaded: "1 week ago",
        },
      ],
    },
    {
      name: "Ivan Petrov",
      role: "Electrician",
      country: "Ukraine",
      flag: "Ukraine",
      applied: "1 week ago",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCbP7H7tnS1HHsJ29ySTdtOLHapm0Qty6vI0irpEqWaS_xXTTDFgQQ8P5VX34MUMsxA1tOGHBJXbLqEq6O57wYwi5swjfi2YGrSpepL806D2N8FoC6x2P_cDXdA9CmzEShGZ1mtJsa2osKgmiqt0ypRP31IAZZYzUfrKsBoIAh5YsJyvoeEjSltE2F8mDa0Cd5Z8eDad_uISvNOVm5St3r_VyJentrAam33D-qlQYnNhvyPtiDZc89LWW4UJl4XFZzEIwcfwIrQsZmz",
      status: "Incomplete",
      statusType: "neutral",
      experience: "5 Years Experience",
      email: "ivan.p@email.com",
      phone: "+380 50 123 4567",
      progress: 30,
      documents: [
        { name: "Passport", status: "approved", exp: "20 Aug 2026" },
        { name: "Seaman's Book", status: "incomplete" },
      ],
    },
  ];

  const applicant = applicants[selectedApplicant];
  const pendingDocs = applicant.documents.filter(
    (d) => d.status === "pending"
  ).length;

  const handleLogout = () => {
    localStorage.removeItem("crew-manning-user");
    localStorage.removeItem("crew-manning-token");
    localStorage.removeItem("crew-manning-profile");
    router.push("/admin/login");
  };

  const handleApproveDoc = async (docName: string) => {
    const token = localStorage.getItem("crew-manning-token");
    try {
      const res = await fetch("/api/v1/admin/seafarers/documents/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ applicantEmail: applicant.email, docName }),
      });
      if (res.ok) {
        alert(`Document "${docName}" approved.`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to approve: ${data?.message || res.statusText}`);
      }
    } catch (err) {
      console.error("approve doc error", err);
      alert("Network error approving document.");
    }
  };

  const handleRejectDoc = async (docName: string) => {
    const token = localStorage.getItem("crew-manning-token");
    try {
      const res = await fetch("/api/v1/admin/seafarers/documents/reject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ applicantEmail: applicant.email, docName }),
      });
      if (res.ok) {
        alert(`Document "${docName}" rejected.`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to reject: ${data?.message || res.statusText}`);
      }
    } catch (err) {
      console.error("reject doc error", err);
      alert("Network error rejecting document.");
    }
  };

  const handleSendInvitation = () => {
    if (!interviewDate || !interviewTime) {
      alert("Please select date and time for the interview.");
      return;
    }
    alert(
      `Interview invitation sent to ${applicant.name} for ${interviewDate} at ${interviewTime}`
    );
  };

  const handleVerifyApplicant = () => {
    alert(`${applicant.name} has been verified!`);
  };

  const handleRejectApplicant = () => {
    if (confirm(`Are you sure you want to reject ${applicant.name}?`)) {
      alert(`${applicant.name} has been rejected.`);
    }
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-[#0e121b] dark:text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#1a202c] border-r border-[#e8ebf3] flex flex-col flex-shrink-0 h-full">
        <div className="p-6 border-b border-[#e8ebf3] flex items-center gap-3">
          <div className="bg-primary rounded-lg size-10 flex items-center justify-center text-white">
            <span className="material-symbols-outlined">anchor</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-none">Maritime Ops</h1>
            <p className="text-[#506795] text-xs font-normal mt-1">
              Crewing Admin
            </p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
              dashboard
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link
            href="/admin/seafarers"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary group"
          >
            <span className="material-symbols-outlined text-[22px]">group</span>
            <span className="text-sm font-medium">Seafarers</span>
          </Link>
          <Link
            href="/admin/shipowners"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
              domain
            </span>
            <span className="text-sm font-medium">Ship Owners / Agents</span>
          </Link>
          <Link
            href="/admin/contracts"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
              description
            </span>
            <span className="text-sm font-medium">Contracts</span>
          </Link>
          <Link
            href="/admin/interviews"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
              event_available
            </span>
            <span className="text-sm font-medium">Interviews</span>
          </Link>
          <Link
            href="/admin/crew-management"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
              work
            </span>
            <span className="text-sm font-medium">Full Crew Mgmt</span>
          </Link>
          <Link
            href="/admin/one-off-crew"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] hover:text-primary transition-colors group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:text-primary">
              assignment_ind
            </span>
            <span className="text-sm font-medium">One-Off Crew</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-[#e8ebf3]">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">
              settings
            </span>
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#506795] hover:bg-[#f0f4fc] transition-colors w-full"
          >
            <span className="material-symbols-outlined text-[22px]">
              logout
            </span>
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark h-full">
        {/* Header */}
        <header className="bg-white dark:bg-[#1a202c] border-b border-[#e8ebf3] h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Seafarers Management</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#506795] text-[20px]">
                search
              </span>
              <input
                className="pl-10 pr-4 py-2 w-64 bg-[#f8f9fb] border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
                placeholder="Search crew..."
                type="text"
              />
            </div>
            <button className="size-10 rounded-full flex items-center justify-center hover:bg-[#f0f4fc] text-[#506795]">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div
              className="size-9 rounded-full bg-cover bg-center border border-[#e8ebf3]"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdWh-Np1nDcZAXcqy2cWNK3gPJ8EtDTJNGVP9FXI0dZSkTlPDHdHbnhq1yeRIMGrMM6pAY2uUcphcCHw-QubRBZw6kQo9k_KLduulwHLZb3dFe81-ov5-iAmyA-q-yXqcYJ4IX1vPBLcI7x-7aUUz60PeWSFSxajUxq-3ah0Th4YgMhkCLt7wVCtVryjCwmnuHFj4gxQyss9HRApiE-UkA1s4uk8GWhho0SwDlQ0wF6VvMqTT64WjBo8SdPJ_T71GxM1Bap5HuMgjt')`,
              }}
            ></div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Applicants List */}
          <div className="flex-1 flex flex-col min-w-[350px] border-r border-[#e8ebf3] bg-white dark:bg-[#1a202c] max-w-[60%]">
            <div className="p-6 pb-0 flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <nav className="flex text-sm text-[#506795] mb-2">
                    <Link
                      className="hover:text-primary"
                      href="/admin/dashboard"
                    >
                      Dashboard
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-[#0e121b] dark:text-white font-medium">
                      Seafarers
                    </span>
                  </nav>
                  <h1 className="text-3xl font-black tracking-tight">
                    Applicants
                  </h1>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
                  <span className="material-symbols-outlined text-[20px]">
                    add
                  </span>
                  New Applicant
                </button>
              </div>
              <div className="flex gap-6 border-b border-[#e8ebf3]">
                <button
                  onClick={() => setActiveTab("new")}
                  className={`pb-3 border-b-2 ${
                    activeTab === "new"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#506795] hover:text-[#0e121b]"
                  } font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  New Applicants
                  <span
                    className={`${
                      activeTab === "new"
                        ? "bg-primary text-white"
                        : "bg-[#e8ebf3] text-[#506795]"
                    } text-[10px] px-1.5 py-0.5 rounded-full font-bold`}
                  >
                    12
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("verified")}
                  className={`pb-3 border-b-2 ${
                    activeTab === "verified"
                      ? "border-primary text-primary"
                      : "border-transparent text-[#506795] hover:text-[#0e121b]"
                  } font-medium text-sm flex items-center gap-2 transition-colors`}
                >
                  Verified Seafarers
                  <span
                    className={`${
                      activeTab === "verified"
                        ? "bg-primary text-white"
                        : "bg-[#e8ebf3] text-[#506795]"
                    } text-[10px] px-1.5 py-0.5 rounded-full font-bold`}
                  >
                    842
                  </span>
                </button>
              </div>
              <div className="flex gap-3 pb-4">
                <select className="form-select bg-[#f8f9fb] border-none rounded-lg text-sm text-[#506795] font-medium py-2 px-3 pr-8 focus:ring-0 cursor-pointer hover:bg-[#eff1f5]">
                  <option>All Ranks</option>
                  <option>Captain</option>
                  <option>Chief Engineer</option>
                  <option>Able Seaman</option>
                </select>
                <select className="form-select bg-[#f8f9fb] border-none rounded-lg text-sm text-[#506795] font-medium py-2 px-3 pr-8 focus:ring-0 cursor-pointer hover:bg-[#eff1f5]">
                  <option>All Nationalities</option>
                  <option>Philippines</option>
                  <option>Ukraine</option>
                  <option>India</option>
                </select>
                <button className="ml-auto text-[#506795] hover:text-primary flex items-center gap-1 text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">
                    filter_list
                  </span>
                  More Filters
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
              {applicants.map((a, i) => (
                <div
                  key={i}
                  className={`group flex items-center p-4 rounded-xl border ${
                    i === selectedApplicant
                      ? "border-primary/20 bg-primary/5"
                      : "border-[#e8ebf3] hover:border-[#d0d5dd] bg-white dark:bg-[#1a202c]"
                  } cursor-pointer shadow-sm relative overflow-hidden transition-all`}
                  onClick={() => setSelectedApplicant(i)}
                >
                  {i === selectedApplicant && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                  )}
                  <div
                    className="size-12 rounded-full bg-cover bg-center mr-4 flex-shrink-0"
                    style={{ backgroundImage: `url('${a.avatar}')` }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <h3 className="font-bold text-[#0e121b] dark:text-white truncate">
                        {a.name}
                      </h3>
                      <span className="text-xs text-[#506795]">
                        Applied {a.applied}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium text-[#0e121b] dark:text-white">
                        {a.role}
                      </span>
                      <span className="w-1 h-1 bg-[#d0d5dd] rounded-full"></span>
                      <span className="text-[#506795] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          flag
                        </span>{" "}
                        {a.country}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-2">
                    {a.statusType === "warning" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-warning/10 text-warning">
                        {a.status}
                      </span>
                    )}
                    {a.statusType === "neutral" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#e8ebf3] text-[#506795]">
                        {a.status}
                      </span>
                    )}
                    {a.statusType === "success" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-success/10 text-success">
                        {a.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Applicant Details Panel */}
          <div className="flex-1 bg-[#f8f9fb] dark:bg-background-dark flex flex-col overflow-hidden h-full">
            {/* Header */}
            <div className="bg-white dark:bg-[#1a202c] p-6 border-b border-[#e8ebf3] flex flex-col gap-4 shadow-sm z-10">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div
                    className="size-16 rounded-lg bg-cover bg-center shadow-inner"
                    style={{ backgroundImage: `url('${applicant.avatar}')` }}
                  ></div>
                  <div>
                    <h2 className="text-xl font-black text-[#0e121b] dark:text-white">
                      {applicant.name}
                    </h2>
                    <p className="text-[#506795] text-sm">
                      {applicant.role} • {applicant.experience}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <a
                        className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                        href={`mailto:${applicant.email}`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          mail
                        </span>{" "}
                        {applicant.email}
                      </a>
                      <span className="text-[#506795] text-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          call
                        </span>{" "}
                        {applicant.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-[#f0f4fc] text-[#506795]"
                    title="Print Profile"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      print
                    </span>
                  </button>
                  <button
                    className="size-8 flex items-center justify-center rounded-lg hover:bg-[#f0f4fc] text-[#506795]"
                    title="More Options"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      more_vert
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Application Progress */}
              <div className="bg-white dark:bg-[#1a202c] p-4 rounded-xl border border-[#e8ebf3]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-[#0e121b] dark:text-white">
                    Application Progress
                  </span>
                  <span className="text-sm font-bold text-primary">
                    {applicant.progress}%
                  </span>
                </div>
                <div className="w-full bg-[#e8ebf3] rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${applicant.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#506795]">
                  <span
                    className={
                      applicant.progress >= 20 ? "text-primary font-bold" : ""
                    }
                  >
                    Applied
                  </span>
                  <span
                    className={
                      applicant.progress >= 40 && applicant.progress < 80
                        ? "text-primary font-bold"
                        : ""
                    }
                  >
                    Document Review
                  </span>
                  <span
                    className={
                      applicant.progress >= 80 ? "text-primary font-bold" : ""
                    }
                  >
                    Interview
                  </span>
                  <span
                    className={
                      applicant.progress >= 100 ? "text-primary font-bold" : ""
                    }
                  >
                    Offer
                  </span>
                </div>
              </div>

              {/* Required Documents */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#506795]">
                    Required Documents
                  </h3>
                  {pendingDocs > 0 && (
                    <span className="text-xs bg-warning/10 text-warning font-bold px-2 py-1 rounded">
                      {pendingDocs} Pending Review
                    </span>
                  )}
                </div>
                <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e8ebf3] overflow-hidden">
                  {applicant.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 ${
                        idx < applicant.documents.length - 1
                          ? "border-b border-[#e8ebf3]"
                          : ""
                      } ${doc.status === "pending" ? "bg-warning/5" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-10 rounded flex items-center justify-center ${
                            doc.status === "approved"
                              ? "bg-green-50 text-green-600"
                              : doc.status === "pending"
                              ? "bg-yellow-50 text-yellow-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          <span className="material-symbols-outlined">
                            {doc.status === "approved"
                              ? "check_circle"
                              : doc.status === "pending"
                              ? "hourglass_top"
                              : "description"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0e121b] dark:text-white">
                            {doc.name}
                          </p>
                          <p className="text-xs text-[#506795]">
                            {doc.exp
                              ? `Exp: ${doc.exp}`
                              : doc.uploaded
                              ? `Uploaded ${doc.uploaded}`
                              : "Not uploaded"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-[#506795] hover:text-primary p-2 rounded hover:bg-[#f0f4fc]"
                          title="View"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            visibility
                          </span>
                        </button>
                        {doc.status === "pending" && (
                          <>
                            <div className="h-4 w-px bg-[#d0d5dd]"></div>
                            <button
                              onClick={() => handleApproveDoc(doc.name)}
                              className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
                              title="Approve"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                check
                              </span>
                            </button>
                            <button
                              onClick={() => handleRejectDoc(doc.name)}
                              className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                              title="Reject"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                close
                              </span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Section */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#506795]">
                    Interview
                  </h3>
                </div>
                <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-[#e8ebf3] p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined">
                        video_call
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#0e121b] dark:text-white">
                        Schedule Technical Interview
                      </h4>
                      <p className="text-xs text-[#506795] mt-1">
                        Invite the applicant for a video call with the
                        Superintendent.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#506795]">
                        Date
                      </span>
                      <input
                        className="w-full bg-[#f8f9fb] border-none rounded-lg text-sm px-3 py-2.5 focus:ring-1 focus:ring-primary"
                        type="date"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#506795]">
                        Time
                      </span>
                      <input
                        className="w-full bg-[#f8f9fb] border-none rounded-lg text-sm px-3 py-2.5 focus:ring-1 focus:ring-primary"
                        type="time"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1 col-span-2">
                      <span className="text-xs font-bold text-[#506795]">
                        Interviewer
                      </span>
                      <select
                        className="w-full bg-[#f8f9fb] border-none rounded-lg text-sm px-3 py-2.5 focus:ring-1 focus:ring-primary text-[#0e121b] dark:text-white"
                        value={interviewer}
                        onChange={(e) => setInterviewer(e.target.value)}
                      >
                        <option>Capt. John Smith (Superintendent)</option>
                        <option>Maria Garcia (HR)</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 col-span-2">
                      <span className="text-xs font-bold text-[#506795]">
                        Meeting Link
                      </span>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-[#9aa4b2] text-[18px]">
                            link
                          </span>
                        </div>
                        <input
                          className="w-full bg-[#f8f9fb] border-none rounded-lg text-sm pl-10 pr-3 py-2.5 focus:ring-1 focus:ring-primary placeholder-[#9aa4b2]"
                          placeholder="Paste video call link here (e.g. Zoom, Teams)"
                          type="url"
                          value={meetingLink}
                          onChange={(e) => setMeetingLink(e.target.value)}
                        />
                      </div>
                    </label>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleSendInvitation}
                      className="bg-[#e8ebf3] hover:bg-[#d0d5dd] text-[#0e121b] px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                      Send Invitation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-white dark:bg-[#1a202c] p-6 border-t border-[#e8ebf3] flex items-center justify-between shrink-0">
              <button
                onClick={handleRejectApplicant}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                Reject Applicant
              </button>
              <div className="flex gap-3">
                <button className="px-5 py-2.5 rounded-lg border border-[#e8ebf3] text-[#0e121b] dark:text-white font-bold text-sm hover:bg-[#f8f9fb] transition-colors">
                  Message
                </button>
                <button
                  onClick={handleVerifyApplicant}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    verified
                  </span>
                  Verify Applicant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
