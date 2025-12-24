import React, { useState } from "react";
import { FiAward } from "react-icons/fi";

// TypeScript interfaces
interface StreakData {
  loginStreak: number;
  loginGoal: number;
  moodLogStreak: number;
  moodLogGoal: number;
}

interface Reward {
  id: number;
  title: string;
  description: string;
  icon: string;
  status: "claimed" | "pending" | "expired";
  startDate: string;
  expiryDate: string;
  claimedDate: string | null;
  points: number;
  type: string;
}

const StreaksRewards: React.FC = () => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  // Static streak data
  const streakData: StreakData = {
    loginStreak: 15,
    loginGoal: 30,
    moodLogStreak: 12,
    moodLogGoal: 21,
  };

  // Static rewards data
  const rewards: Reward[] = [
    {
      id: 1,
      title: "7-Day Login Streak",
      description:
        "Congratulations on maintaining a 7-day login streak! Keep up the great work.",
      icon: "🔥",
      status: "claimed",
      startDate: "2024-01-08",
      expiryDate: "2024-02-08",
      claimedDate: "2024-01-15",
      points: 100,
      type: "Login Milestone",
    },
    {
      id: 2,
      title: "First Mood Log",
      description:
        "You've logged your first mood! This is the beginning of your emotional wellness journey.",
      icon: "❤️",
      status: "claimed",
      startDate: "2024-01-01",
      expiryDate: "2024-02-01",
      claimedDate: "2024-01-02",
      points: 50,
      type: "Achievement",
    },
    {
      id: 3,
      title: "10 Moods Logged",
      description:
        "You've successfully logged 10 moods! You're building a great habit.",
      icon: "⚡",
      status: "claimed",
      startDate: "2024-01-05",
      expiryDate: "2024-02-05",
      claimedDate: "2024-01-10",
      points: 150,
      type: "Mood Milestone",
    },
    {
      id: 4,
      title: "15-Day Login Streak",
      description:
        "Amazing! You've logged in for 15 consecutive days. You're on fire!",
      icon: "🏆",
      status: "pending",
      startDate: "2024-01-15",
      expiryDate: "2024-02-15",
      claimedDate: null,
      points: 200,
      type: "Login Milestone",
    },
    {
      id: 5,
      title: "Green Zone Champion",
      description:
        "You've spent 7 consecutive days in the Green Zone! Excellent emotional balance.",
      icon: "🌟",
      status: "pending",
      startDate: "2024-01-12",
      expiryDate: "2024-02-12",
      claimedDate: null,
      points: 250,
      type: "Special Achievement",
    },
    {
      id: 6,
      title: "Early Adopter",
      description:
        "You were one of the first to join Serene Minds. Thank you for being part of our community!",
      icon: "🎉",
      status: "expired",
      startDate: "2023-12-01",
      expiryDate: "2024-01-01",
      claimedDate: null,
      points: 300,
      type: "Special Achievement",
    },
  ];

  const handleClaimReward = (rewardId: number) => {
    // Claim logic here
    alert(`Reward claimed successfully! Points added to your account.`);
    // In real implementation, this would update the backend
  };

  const loginProgress = (streakData.loginStreak / streakData.loginGoal) * 100;
  const moodLogProgress =
    (streakData.moodLogStreak / streakData.moodLogGoal) * 100;

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "claimed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "expired":
        return "bg-gray-100 text-gray-500";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <h2 className="text-2xl font-bold m-0">Streaks & Rewards</h2>
        <p className="text-gray-500 mt-1.5 text-sm">
          Track your progress and earn rewards for staying consistent
        </p>
      </div>

      {/* Streak Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {/* Login Streak */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex justify-between items-start mb-4">
            <div className="text-base font-semibold text-slate-900">
              Login Streak
            </div>
            <div className="text-3xl">🔥</div>
          </div>
          <div className="text-4xl font-bold text-slate-900 mb-1">
            {streakData.loginStreak}
          </div>
          <div className="text-sm text-slate-500 mb-4">consecutive days</div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-[#1ecab8] to-[#1bb8a6] rounded-full transition-all"
              style={{ width: `${loginProgress}%` }}
            />
          </div>
          <div className="text-xs text-slate-600 opacity-90">
            {streakData.loginStreak}/{streakData.loginGoal} days to next reward
          </div>
        </div>

        {/* Mood Log Streak */}
        <div
          className="rounded-xl p-6 shadow-sm text-white"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="text-base font-semibold">Mood Log Streak</div>
            <div className="text-3xl">⚡</div>
          </div>
          <div className="text-4xl font-bold mb-1">
            {streakData.moodLogStreak}
          </div>
          <div className="text-sm opacity-90 mb-4">consecutive days logged</div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${moodLogProgress}%` }}
            />
          </div>
          <div className="text-xs opacity-90">
            {streakData.moodLogStreak}/{streakData.moodLogGoal} days to next
            reward
          </div>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="bg-white rounded-xl p-7 mb-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-6">
          <FiAward />
          Your Rewards
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["All", "Claimed", "Pending", "Expired"].map((filter) => (
            <button
              key={filter}
              className={`px-5 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                filter === "All"
                  ? "bg-[#1ecab8] text-white border-[#1ecab8]"
                  : "bg-white text-gray-600 border-gray-300 hover:border-[#1ecab8] hover:text-[#1ecab8]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">{reward.icon}</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadgeClass(
                    reward.status
                  )}`}
                >
                  {reward.status}
                </span>
              </div>
              <div className="text-lg font-bold text-slate-900 mb-2">
                {reward.title}
              </div>
              <div className="text-xs text-[#1ecab8] font-semibold mb-3 uppercase tracking-wide">
                {reward.type}
              </div>
              <div className="text-sm text-slate-600 mb-4 leading-relaxed">
                {reward.description}
              </div>
              <div className="text-xs text-slate-500 space-y-1 mb-4">
                <div>Start: {reward.startDate}</div>
                <div>Expires: {reward.expiryDate}</div>
                {reward.claimedDate && (
                  <div>Claimed: {reward.claimedDate}</div>
                )}
              </div>
              <div className="text-lg font-bold text-[#1ecab8] mb-4">
                {reward.points} Points
              </div>
              {reward.status === "pending" && (
                <button
                  className="w-full px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
                  onClick={() => handleClaimReward(reward.id)}
                >
                  Claim Reward
                </button>
              )}
              {reward.status === "claimed" && (
                <button
                  className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium cursor-default"
                  onClick={() => setSelectedReward(reward)}
                >
                  View Details
                </button>
              )}
              {reward.status === "expired" && (
                <button
                  className="w-full px-4 py-2 bg-gray-200 text-gray-500 rounded-lg font-medium opacity-60 cursor-not-allowed"
                  disabled
                >
                  Expired
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Section */}
      <div
        className="rounded-2xl p-8 text-white text-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        }}
      >
        <div className="text-5xl mb-4">🎯</div>
        <h3 className="text-2xl font-bold mb-3">Keep Up the Great Work!</h3>
        <p className="text-base opacity-95 leading-relaxed">
          You're doing an amazing job tracking your emotions and maintaining
          your streaks. Remember, consistency is key to emotional wellness.
          Keep logging your moods and watch your progress grow!
        </p>
      </div>

      {/* Reward Details Modal */}
      {selectedReward && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => setSelectedReward(null)}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Reward Details
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => setSelectedReward(null)}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="text-center p-8 bg-gray-50 rounded-xl mb-6">
                <div className="text-7xl mb-4">{selectedReward.icon}</div>
                <div className="text-2xl font-bold text-slate-900 mb-2">
                  {selectedReward.title}
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusBadgeClass(
                    selectedReward.status
                  )}`}
                >
                  {selectedReward.status}
                </span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                    Type
                  </div>
                  <div className="text-base font-semibold">
                    {selectedReward.type}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                    Description
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {selectedReward.description}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                      Start Date
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReward.startDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                      Expiry Date
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReward.expiryDate}
                    </div>
                  </div>
                </div>

                {selectedReward.claimedDate && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                      Claimed Date
                    </div>
                    <div className="text-sm font-semibold">
                      {selectedReward.claimedDate}
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                    Points Earned
                  </div>
                  <div className="text-3xl font-bold text-[#1ecab8]">
                    {selectedReward.points}
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={() => setSelectedReward(null)}
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

export default StreaksRewards;

