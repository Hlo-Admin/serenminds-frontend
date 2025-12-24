import React, { useState } from "react";
import {
  FiMail,
  FiMessageCircle,
  FiSend,
  FiCopy,
  FiCheck,
  FiEdit,
  FiEye,
} from "react-icons/fi";

// TypeScript interfaces
interface InviteForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface InviteStats {
  totalSent: number;
  accepted: number;
  pending: number;
  declined: number;
  pointsEarned: number;
}

interface SentInvite {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  method: string;
  status: "accepted" | "pending" | "declined";
  sentDate: string;
  acceptedDate: string | null;
}

const Referrals: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showOverview, setShowOverview] = useState<boolean>(false);
  const [inviteMethod, setInviteMethod] = useState<string>("");
  const [editingInvite, setEditingInvite] = useState<SentInvite | null>(null);
  const [inviteForm, setInviteForm] = useState<InviteForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [copied, setCopied] = useState<boolean>(false);

  // Static referral data
  const referralCode = "SERENE-SJ2024";
  const referralLink = "https://sereneminds.app/join?ref=SERENE-SJ2024";

  const inviteStats: InviteStats = {
    totalSent: 12,
    accepted: 5,
    pending: 4,
    declined: 3,
    pointsEarned: 500,
  };

  const sentInvites: SentInvite[] = [
    {
      id: 1,
      name: "Emily Chen",
      email: "emily.chen@email.com",
      method: "Email",
      status: "accepted",
      sentDate: "2024-01-10",
      acceptedDate: "2024-01-12",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      email: "marcus.j@email.com",
      method: "Email",
      status: "accepted",
      sentDate: "2024-01-08",
      acceptedDate: "2024-01-09",
    },
    {
      id: 3,
      name: "Sarah Williams",
      phone: "+1 (555) 234-5678",
      method: "SMS",
      status: "pending",
      sentDate: "2024-01-14",
      acceptedDate: null,
    },
    {
      id: 4,
      name: "David Lee",
      email: "david.lee@email.com",
      method: "Email",
      status: "accepted",
      sentDate: "2024-01-05",
      acceptedDate: "2024-01-07",
    },
    {
      id: 5,
      name: "Jessica Brown",
      phone: "+1 (555) 345-6789",
      method: "WhatsApp",
      status: "pending",
      sentDate: "2024-01-13",
      acceptedDate: null,
    },
    {
      id: 6,
      name: "Alex Martinez",
      email: "alex.m@email.com",
      method: "Email",
      status: "declined",
      sentDate: "2024-01-03",
      acceptedDate: null,
    },
    {
      id: 7,
      name: "Olivia Taylor",
      email: "olivia.t@email.com",
      method: "Email",
      status: "accepted",
      sentDate: "2024-01-02",
      acceptedDate: "2024-01-04",
    },
    {
      id: 8,
      name: "Ryan Anderson",
      phone: "+1 (555) 456-7890",
      method: "SMS",
      status: "pending",
      sentDate: "2024-01-15",
      acceptedDate: null,
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editingInvite) {
      alert(`Invite updated successfully!`);
      setEditingInvite(null);
    } else {
      alert(`Invite sent via ${inviteMethod}!`);
    }
    setShowInviteModal(false);
    setInviteForm({ name: "", email: "", phone: "", message: "" });
    setInviteMethod("");
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: { bg: string; color: string } } = {
      accepted: { bg: "rgba(46, 213, 115, 0.15)", color: "#27ae60" },
      pending: { bg: "rgba(241, 196, 15, 0.15)", color: "#f39c12" },
      declined: { bg: "rgba(149, 165, 166, 0.15)", color: "#7f8c8d" },
    };
    const style = styles[status];
    return (
      <span
        className="px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide"
        style={{
          background: style.bg,
          color: style.color,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <h2 className="text-2xl font-bold m-0">Invite Friends</h2>
        <p className="text-gray-500 mt-1.5 text-sm">
          Share Serene Minds with friends and earn rewards together
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Total Sent
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-blue-100">
              📤
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {inviteStats.totalSent}
          </div>
          <div className="text-xs text-slate-500">invitations</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Accepted
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-green-100">
              ✅
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {inviteStats.accepted}
          </div>
          <div className="text-xs text-slate-500">friends joined</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">Pending</span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-yellow-100">
              ⏳
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {inviteStats.pending}
          </div>
          <div className="text-xs text-slate-500">awaiting response</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-semibold text-slate-600">
              Points Earned
            </span>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-purple-100">
              ⭐
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {inviteStats.pointsEarned}
          </div>
          <div className="text-xs text-slate-500">reward points</div>
        </div>
      </div>

      {/* Referral Code Section */}
      <div
        className="rounded-2xl p-8 text-white mb-6 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #00c7b7 0%, #009e8e 100%)",
        }}
      >
        <h3 className="text-xl font-bold mb-4">Your Personal Referral Code</h3>
        <div className="bg-white/20 rounded-xl p-5 mb-5">
          <div className="text-sm opacity-90 mb-2">Referral Code</div>
          <div className="flex items-center justify-between gap-4">
            <div className="text-2xl font-bold tracking-wider">
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="bg-white text-[#1ecab8] border-none rounded-lg px-5 py-2.5 font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        <div className="bg-white/20 rounded-xl p-5">
          <div className="text-sm opacity-90 mb-2">Referral Link</div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm font-semibold break-all flex-1">
              {referralLink}
            </div>
            <button
              onClick={handleCopyLink}
              className="bg-white text-[#1ecab8] border-none rounded-lg px-5 py-2.5 font-semibold cursor-pointer flex items-center gap-2 transition-all hover:bg-gray-50 flex-shrink-0"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Invite Methods */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <h3 className="text-lg font-bold mb-5 text-slate-900">
          Send an Invite
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => {
              setInviteMethod("email");
              setShowInviteModal(true);
            }}
            className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 cursor-pointer transition-all text-center hover:border-[#1ecab8] hover:bg-white group"
          >
            <FiMail
              size={32}
              className="text-[#1ecab8] mb-3 mx-auto group-hover:scale-110 transition-transform"
            />
            <div className="font-semibold text-base text-slate-900">Email</div>
            <div className="text-xs text-gray-500 mt-1">Send via email</div>
          </button>

          <button
            onClick={() => {
              setInviteMethod("whatsapp");
              setShowInviteModal(true);
            }}
            className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 cursor-pointer transition-all text-center hover:border-[#1ecab8] hover:bg-white group"
          >
            <FiMessageCircle
              size={32}
              className="text-[#1ecab8] mb-3 mx-auto group-hover:scale-110 transition-transform"
            />
            <div className="font-semibold text-base text-slate-900">
              WhatsApp
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Share on WhatsApp
            </div>
          </button>

          <button
            onClick={() => {
              setInviteMethod("sms");
              setShowInviteModal(true);
            }}
            className="bg-gray-50 border-2 border-gray-300 rounded-xl p-6 cursor-pointer transition-all text-center hover:border-[#1ecab8] hover:bg-white group"
          >
            <FiSend
              size={32}
              className="text-[#1ecab8] mb-3 mx-auto group-hover:scale-110 transition-transform"
            />
            <div className="font-semibold text-base text-slate-900">SMS</div>
            <div className="text-xs text-gray-500 mt-1">Send text message</div>
          </button>
        </div>
      </div>

      {/* Sent Invites */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="p-6 pb-5">
          <h3 className="text-lg font-bold m-0 text-slate-900">
            Sent Invitations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Contact
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Method
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Sent Date
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700">
                  Accepted Date
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700 w-20">
                  Edit
                </th>
                <th className="p-4 text-left border-b border-gray-200 text-sm font-semibold text-gray-700 w-20">
                  Overview
                </th>
              </tr>
            </thead>
            <tbody>
              {sentInvites.map((invite) => (
                <tr key={invite.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b border-gray-100 font-semibold text-slate-900">
                    {invite.name}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-600">
                    {invite.email || invite.phone}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold">
                      {invite.method}
                    </span>
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-600">
                    {invite.sentDate}
                  </td>
                  <td className="p-4 border-b border-gray-100">
                    {getStatusBadge(invite.status)}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-sm text-gray-600">
                    {invite.acceptedDate || "—"}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-center">
                    {invite.status === "pending" ? (
                      <button
                        onClick={() => {
                          setEditingInvite(invite);
                          setInviteMethod(invite.method.toLowerCase());
                          setInviteForm({
                            name: invite.name,
                            email: invite.email || "",
                            phone: invite.phone || "",
                            message: "",
                          });
                          setShowInviteModal(true);
                        }}
                        title="Edit Invite"
                        className="bg-transparent border-none text-yellow-600 cursor-pointer inline-flex items-center justify-center p-0 rounded-md transition-all w-8 h-8 mx-auto hover:bg-yellow-50 hover:scale-110"
                      >
                        <FiEdit size={18} />
                      </button>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="p-4 border-b border-gray-100 text-center">
                    <button
                      onClick={() => setShowOverview(true)}
                      title="View Overview"
                      className="bg-transparent border-none text-[#1ecab8] cursor-pointer inline-flex items-center justify-center p-0 rounded-md transition-all w-8 h-8 mx-auto hover:bg-teal-50 hover:scale-110"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {editingInvite
                  ? "Edit Invite"
                  : `Send Invite via ${
                      inviteMethod === "email"
                        ? "Email"
                        : inviteMethod === "whatsapp"
                        ? "WhatsApp"
                        : "SMS"
                    }`}
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => setShowInviteModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleInviteSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Friend's Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    placeholder="Enter name"
                    value={inviteForm.name}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                {inviteMethod === "email" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                      placeholder="friend@email.com"
                      value={inviteForm.email}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, email: e.target.value })
                      }
                      required
                    />
                  </div>
                )}

                {(inviteMethod === "sms" || inviteMethod === "whatsapp") && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                      value={inviteForm.phone}
                      onChange={(e) =>
                        setInviteForm({ ...inviteForm, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Personal Message (optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent min-h-[100px]"
                    placeholder="Add a personal note to your invitation..."
                    value={inviteForm.message}
                    onChange={(e) =>
                      setInviteForm({ ...inviteForm, message: e.target.value })
                    }
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed">
                  Your referral link will be automatically included in the
                  invitation message.
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setShowInviteModal(false);
                    setEditingInvite(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center gap-2"
                >
                  <FiSend /> {editingInvite ? "Update Invite" : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overview Modal */}
      {showOverview && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => setShowOverview(false)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Referrals Overview
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => setShowOverview(false)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-2">Total Sent</div>
                    <div className="text-3xl font-bold text-[#1ecab8]">
                      {inviteStats.totalSent}
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-2">Accepted</div>
                    <div className="text-3xl font-bold text-green-600">
                      {inviteStats.accepted}
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-2">Pending</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {inviteStats.pending}
                    </div>
                  </div>
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500 mb-2">
                      Points Earned
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      {inviteStats.pointsEarned}
                    </div>
                  </div>
                </div>

                {/* Success Rate */}
                <div className="p-5 bg-blue-50 rounded-xl border-2 border-[#1ecab8]">
                  <div className="text-sm text-gray-600 mb-2">
                    Acceptance Rate
                  </div>
                  <div className="text-2xl font-bold text-[#1ecab8]">
                    {Math.round(
                      (inviteStats.accepted / inviteStats.totalSent) * 100
                    )}
                    %
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    {inviteStats.accepted} out of {inviteStats.totalSent}{" "}
                    invites accepted
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <div className="text-base font-semibold mb-4">
                    Recent Activity
                  </div>
                  <div className="space-y-3">
                    {sentInvites.slice(0, 5).map((invite) => (
                      <div
                        key={invite.id}
                        className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <div className="font-semibold text-sm">
                            {invite.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {invite.method} · {invite.sentDate}
                          </div>
                        </div>
                        {getStatusBadge(invite.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setShowOverview(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referrals;

