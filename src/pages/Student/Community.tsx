import React, { useState } from "react";
import {
  FiUsers,
  FiPlus,
  FiThumbsUp,
  FiMessageCircle,
  FiShare2,
  FiFlag,
  FiBookmark,
  FiMoreVertical,
  FiEdit,
  FiUserPlus,
  FiActivity,
} from "react-icons/fi";

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  posts: number;
  icon: string;
  color: string;
  joined: boolean;
}

interface Post {
  id: number;
  communityId: number;
  communityName: string;
  author: string;
  authorAvatar: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  pinned: boolean;
}

interface Member {
  id: number;
  name: string;
  role: string;
  joined: string;
  avatar: string;
}

interface Activity {
  action: string;
  date: string;
  type: string;
}

const Community: React.FC = () => {
  const [activeView, setActiveView] = useState<"communities" | "posts">("communities");
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditCommunity, setShowEditCommunity] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [selectedCommunityForMembers, setSelectedCommunityForMembers] = useState<Community | null>(null);
  const [reportTarget, setReportTarget] = useState<Post | null>(null);
  const [postContent, setPostContent] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [likedPosts, setLikedPosts] = useState<number[]>([1, 5, 8]);

  // Static communities data
  const communities: Community[] = [
    {
      id: 1,
      name: "Mindfulness & Meditation",
      description:
        "A space for sharing meditation techniques, mindfulness practices, and peaceful moments.",
      members: 1234,
      posts: 456,
      icon: "🧘",
      color: "#a29bfe",
      joined: true,
    },
    {
      id: 2,
      name: "Student Wellness Hub",
      description:
        "Connect with fellow students, share experiences, and support each other's mental health journey.",
      members: 2456,
      posts: 892,
      icon: "🎓",
      color: "#74b9ff",
      joined: true,
    },
    {
      id: 3,
      name: "Anxiety Support Group",
      description:
        "A safe space to discuss anxiety, coping strategies, and find support from others who understand.",
      members: 987,
      posts: 345,
      icon: "💙",
      color: "#00b894",
      joined: false,
    },
    {
      id: 4,
      name: "Gratitude Circle",
      description:
        "Share what you're grateful for each day and spread positivity within the community.",
      members: 1567,
      posts: 678,
      icon: "🙏",
      color: "#feca57",
      joined: true,
    },
    {
      id: 5,
      name: "Creative Expression",
      description:
        "Express yourself through art, music, writing, and other creative outlets. All forms welcome!",
      members: 892,
      posts: 234,
      icon: "🎨",
      color: "#ff6b6b",
      joined: false,
    },
    {
      id: 6,
      name: "Fitness & Wellness",
      description:
        "Discuss physical wellness, exercise routines, healthy habits, and their impact on mental health.",
      members: 1789,
      posts: 567,
      icon: "💪",
      color: "#ee5a6f",
      joined: false,
    },
  ];

  // Static posts data
  const posts: Post[] = [
    {
      id: 1,
      communityId: 2,
      communityName: "Student Wellness Hub",
      author: "Sarah Johnson",
      authorAvatar: "SJ",
      content:
        "Just wanted to share that I've been using the mood logging feature for 2 weeks now and it's really helping me understand my emotional patterns. Highly recommend staying consistent with it! 💙",
      likes: 45,
      comments: 12,
      time: "2 hours ago",
      pinned: true,
    },
    {
      id: 2,
      communityId: 1,
      communityName: "Mindfulness & Meditation",
      author: "Alex Chen",
      authorAvatar: "AC",
      content:
        "Started my day with a 10-minute meditation session. Feeling so much more centered and ready to take on the day. What's your morning routine? 🧘‍♀️",
      likes: 67,
      comments: 23,
      time: "4 hours ago",
      pinned: false,
    },
    {
      id: 3,
      communityId: 4,
      communityName: "Gratitude Circle",
      author: "Maya Patel",
      authorAvatar: "MP",
      content:
        "Today I'm grateful for: ☀️ Beautiful weather, 📚 A good book, 👨‍👩‍👧 Family time, 🎵 My favorite music. What are you grateful for today?",
      likes: 89,
      comments: 34,
      time: "5 hours ago",
      pinned: false,
    },
    {
      id: 4,
      communityId: 2,
      communityName: "Student Wellness Hub",
      author: "Jordan Lee",
      authorAvatar: "JL",
      content:
        "Does anyone else struggle with Sunday anxiety? That feeling of dread about the upcoming week? Looking for some coping strategies that have worked for you all.",
      likes: 34,
      comments: 28,
      time: "6 hours ago",
      pinned: false,
    },
    {
      id: 5,
      communityId: 1,
      communityName: "Mindfulness & Meditation",
      author: "Emma Rodriguez",
      authorAvatar: "ER",
      content:
        "Sharing a breathing exercise that helped me during a stressful moment today: 4-7-8 technique. Breathe in for 4, hold for 7, exhale for 8. Repeat 4 times. Works wonders! 🌬️",
      likes: 112,
      comments: 19,
      time: "8 hours ago",
      pinned: true,
    },
    {
      id: 6,
      communityId: 4,
      communityName: "Gratitude Circle",
      author: "David Kim",
      authorAvatar: "DK",
      content:
        "Grateful for this community and all the support you all provide. It's amazing to have a space where we can be vulnerable and authentic. Thank you all! 🙏",
      likes: 156,
      comments: 42,
      time: "10 hours ago",
      pinned: false,
    },
    {
      id: 7,
      communityId: 2,
      communityName: "Student Wellness Hub",
      author: "Lisa Zhang",
      authorAvatar: "LZ",
      content:
        "Just aced my presentation that I was super anxious about! Remember: You're more capable than you think. Believe in yourself! 💪✨",
      likes: 203,
      comments: 56,
      time: "12 hours ago",
      pinned: false,
    },
    {
      id: 8,
      communityId: 1,
      communityName: "Mindfulness & Meditation",
      author: "Marcus Thompson",
      authorAvatar: "MT",
      content:
        "New to meditation. Any app recommendations or guided meditation resources for beginners? Would love your suggestions! 🙏",
      likes: 23,
      comments: 31,
      time: "14 hours ago",
      pinned: false,
    },
  ];

  const handleJoinCommunity = (communityId: number) => {
    alert("Joined community successfully!");
  };

  const handleExitCommunity = (communityId: number) => {
    if (window.confirm("Are you sure you want to exit this community?")) {
      alert("Left community successfully!");
    }
  };

  const handleLikePost = (postId: number) => {
    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => id !== postId));
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    alert("Post created successfully!");
    setPostContent("");
    setShowCreatePost(false);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditPostContent(post.content);
    setShowEditPost(true);
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPostContent.trim()) return;
    alert("Post updated successfully!");
    setShowEditPost(false);
    setEditingPost(null);
    setEditPostContent("");
  };

  const handleEditCommunity = (community: Community) => {
    setEditingCommunity(community);
    setShowEditCommunity(true);
  };

  const handleViewMembers = (community: Community) => {
    setSelectedCommunityForMembers(community);
    setShowMembers(true);
  };

  const handleReportPost = (post: Post) => {
    setReportTarget(post);
    setShowReportModal(true);
  };

  const handlePinPost = (postId: number) => {
    alert("Post pinned successfully!");
  };

  const myPosts = posts.filter((post) => post.author === "Sarah Johnson");
  const joinedCommunityIds = communities
    .filter((c) => c.joined)
    .map((c) => c.id);
  const filteredPosts = posts.filter((post) =>
    joinedCommunityIds.includes(post.communityId)
  );

  const members: Member[] = [
    { id: 1, name: "Sarah Johnson", role: "Admin", joined: "2024-01-01", avatar: "SJ" },
    { id: 2, name: "Alex Chen", role: "Member", joined: "2024-01-05", avatar: "AC" },
    { id: 3, name: "Maya Patel", role: "Member", joined: "2024-01-08", avatar: "MP" },
    { id: 4, name: "Jordan Lee", role: "Member", joined: "2024-01-10", avatar: "JL" },
  ];

  const activities: Activity[] = [
    { action: "Created post", date: "2024-01-15 14:30", type: "post" },
    { action: "Liked a post", date: "2024-01-14 10:20", type: "like" },
    { action: "Commented on post", date: "2024-01-13 16:45", type: "comment" },
    { action: "Joined community", date: "2024-01-01 09:00", type: "join" },
  ];

  return (
    <div className="p-6 bg-[#fafbfc] min-h-screen max-w-[1600px] mx-auto font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,'Helvetica_Neue',Arial,sans-serif]">
      {/* Header */}
      <div className="bg-white rounded-[14px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold m-0">Community</h2>
          <p className="text-[#888] mt-1.5 text-sm">Connect, share, and support each other</p>
        </div>
        <div className="flex gap-3">
          <button
            className={`px-4 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit flex items-center gap-2 ${
              activeView === "communities"
                ? "bg-[#00c7b7] text-white hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)]"
                : "bg-[#f0f0f0] text-[#666] hover:bg-[#e0e0e0]"
            }`}
            onClick={() => setActiveView("communities")}
          >
            <FiUsers /> Communities
          </button>
          <button
            className={`px-4 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit flex items-center gap-2 ${
              activeView === "posts"
                ? "bg-[#00c7b7] text-white hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)]"
                : "bg-[#f0f0f0] text-[#666] hover:bg-[#e0e0e0]"
            }`}
            onClick={() => setActiveView("posts")}
          >
            <FiMessageCircle /> Posts
          </button>
        </div>
      </div>

      {/* Communities View */}
      {activeView === "communities" && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 mb-6">
          {communities.map((community) => (
            <div
              key={community.id}
              className="bg-white rounded-[14px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all duration-200 flex flex-col overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-[60px] h-[60px] rounded-xl flex items-center justify-center text-2xl text-white font-bold"
                  style={{ background: community.color }}
                >
                  {community.icon}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-[#222] mb-1">{community.name}</div>
                  <div className="text-[13px] text-[#888]">
                    {community.members} members · {community.posts} posts
                  </div>
                </div>
              </div>
              <div className="text-sm text-[#666] leading-relaxed mb-4 flex-1">
                {community.description}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-auto w-full">
                {community.joined ? (
                  <>
                    <button
                      className="bg-[#f0f0f0] text-[#666] px-3 py-2 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis"
                      onClick={() => handleExitCommunity(community.id)}
                    >
                      Exit
                    </button>
                    <button
                      className="bg-[#f0f0f0] text-[#666] px-3 py-2 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
                      onClick={() => handleEditCommunity(community)}
                    >
                      <FiEdit className="text-sm" /> <span>Edit</span>
                    </button>
                    <button
                      className="bg-[#00c7b7] text-white px-3 py-2 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
                      onClick={() => {
                        setSelectedCommunity(community);
                        setShowCreatePost(true);
                      }}
                    >
                      <FiPlus className="text-sm" /> <span>Post</span>
                    </button>
                    <button
                      className="bg-[#f0f0f0] text-[#666] px-3 py-2 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0] text-[13px] whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
                      onClick={() => handleViewMembers(community)}
                    >
                      <FiUsers className="text-sm" /> <span>Members</span>
                    </button>
                  </>
                ) : (
                  <button
                    className="col-span-4 w-full bg-[#00c7b7] text-white px-4 py-2.5 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)] text-sm"
                    onClick={() => handleJoinCommunity(community.id)}
                  >
                    Join Community
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts View */}
      {activeView === "posts" && (
        <div>
          {/* Create Post Button */}
          <div className="mb-6">
            <button
              className="bg-[#00c7b7] text-white px-4 py-4 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)] flex items-center gap-2 w-full justify-center"
              onClick={() => setShowCreatePost(true)}
            >
              <FiPlus /> Create New Post
            </button>
          </div>

          {/* Posts List */}
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-[14px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-4">
              {post.pinned && (
                <div className="flex items-center gap-1.5 text-xs text-[#00c7b7] font-semibold mb-3 uppercase tracking-wide">
                  <FiBookmark /> Pinned Post
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00c7b7] to-[#009e8e] flex items-center justify-center text-base text-white font-bold">
                  {post.authorAvatar}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] font-semibold text-[#222] mb-0.5">{post.author}</div>
                  <div className="text-xs text-[#999]">
                    {post.communityName} · {post.time}
                  </div>
                </div>
                <div className="flex gap-2">
                  {post.author === "Sarah Johnson" && (
                    <button
                      onClick={() => handleEditPost(post)}
                      className="bg-transparent border-none cursor-pointer p-2 rounded-lg text-[#f39c12] hover:bg-[#f9f9f9]"
                      title="Edit Post"
                    >
                      <FiEdit size={18} />
                    </button>
                  )}
                  <button className="bg-transparent border-none cursor-pointer p-2 rounded-lg text-[#888] hover:bg-[#f9f9f9]">
                    <FiMoreVertical size={20} />
                  </button>
                </div>
              </div>

              <div className="text-[15px] text-[#444] leading-relaxed mb-4">{post.content}</div>

              <div className="flex gap-4 pt-3 border-t border-[#f0f0f0]">
                <button
                  className={`bg-transparent border-none flex items-center gap-1.5 text-sm text-[#888] cursor-pointer transition-colors duration-200 p-0 hover:text-[#00c7b7] ${
                    likedPosts.includes(post.id) ? "text-[#00c7b7] font-semibold" : ""
                  }`}
                  onClick={() => handleLikePost(post.id)}
                >
                  <FiThumbsUp />
                  {likedPosts.includes(post.id) ? post.likes + 1 : post.likes}
                </button>

                <button className="bg-transparent border-none flex items-center gap-1.5 text-sm text-[#888] cursor-pointer transition-colors duration-200 p-0 hover:text-[#00c7b7]">
                  <FiMessageCircle />
                  {post.comments}
                </button>

                <button className="bg-transparent border-none flex items-center gap-1.5 text-sm text-[#888] cursor-pointer transition-colors duration-200 p-0 hover:text-[#00c7b7]">
                  <FiShare2 />
                  Share
                </button>

                <button
                  className="bg-transparent border-none flex items-center gap-1.5 text-sm text-[#888] cursor-pointer transition-colors duration-200 p-0 hover:text-[#00c7b7]"
                  onClick={() => handleReportPost(post)}
                >
                  <FiFlag />
                  Report
                </button>

                {post.author === "Sarah Johnson" && (
                  <button
                    className="bg-transparent border-none flex items-center gap-1.5 text-sm text-[#888] cursor-pointer transition-colors duration-200 p-0 hover:text-[#00c7b7]"
                    onClick={() => handlePinPost(post.id)}
                  >
                    <FiBookmark />
                    Pin
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-[60px] px-5 text-[#999]">
              <div className="text-[64px] mb-4 opacity-50">💬</div>
              <div className="text-xl font-semibold text-[#666] mb-2">No posts yet</div>
              <div className="text-[15px] text-[#999]">
                Join a community and start engaging with others
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePost && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => setShowCreatePost(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">Create Post</h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => setShowCreatePost(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="mb-6">
                {selectedCommunity && (
                  <div className="flex items-center gap-3 p-3 bg-[#f9f9f9] rounded-[10px] mb-5">
                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl"
                      style={{ background: selectedCommunity.color }}
                    >
                      {selectedCommunity.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#222]">
                        {selectedCommunity.name}
                      </div>
                      <div className="text-xs text-[#888]">Posting as Sarah Johnson</div>
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#444] mb-2">
                    What's on your mind?
                  </label>
                  <textarea
                    className="w-full p-3 border border-[#e0e0e0] rounded-[10px] text-[15px] font-inherit bg-[#f9f9f9] transition-all duration-200 box-border focus:outline-none focus:border-[#00c7b7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,199,183,0.1)] resize-y min-h-[150px]"
                    placeholder="Share your thoughts, experiences, or ask a question..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    required
                  />
                </div>

                <div className="p-4 bg-[#f0f9ff] rounded-[10px] text-sm text-[#0369a1] leading-relaxed">
                  💡 Remember to be respectful and supportive. Our community thrives on kindness
                  and understanding.
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                  onClick={() => setShowCreatePost(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00c7b7] text-white px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)] flex items-center gap-2"
                >
                  <FiPlus /> Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && reportTarget && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">Report Post</h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => setShowReportModal(false)}
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <p className="text-[15px] text-[#666] mb-5">
                Please select a reason for reporting this post:
              </p>

              <div className="grid gap-3">
                {[
                  "Inappropriate content",
                  "Spam or misleading",
                  "Harassment or bullying",
                  "Hate speech",
                  "Violence or dangerous content",
                  "Other",
                ].map((reason) => (
                  <label
                    key={reason}
                    className="p-4 border-2 border-[#e0e0e0] rounded-[10px] cursor-pointer flex items-center gap-3 transition-all duration-200 hover:border-[#00c7b7] hover:bg-[#f9f9f9]"
                  >
                    <input type="radio" name="reportReason" value={reason} />
                    <span className="text-[15px] font-medium">{reason}</span>
                  </label>
                ))}
              </div>

              <div className="mt-5 mb-0">
                <label className="block text-sm font-semibold text-[#444] mb-2">
                  Additional details (optional)
                </label>
                <textarea
                  className="w-full p-3 border border-[#e0e0e0] rounded-[10px] text-[15px] font-inherit bg-[#f9f9f9] transition-all duration-200 box-border focus:outline-none focus:border-[#00c7b7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,199,183,0.1)] resize-y min-h-[100px]"
                  placeholder="Provide more context about why you're reporting this post..."
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#00c7b7] text-white px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)]"
                onClick={() => {
                  alert(
                    "Post reported successfully. Thank you for helping keep our community safe."
                  );
                  setShowReportModal(false);
                }}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Community Modal */}
      {showEditCommunity && editingCommunity && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => {
            setShowEditCommunity(false);
            setEditingCommunity(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">Edit Community</h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => {
                  setShowEditCommunity(false);
                  setEditingCommunity(null);
                }}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Community updated successfully!");
                setShowEditCommunity(false);
                setEditingCommunity(null);
              }}
            >
              <div className="mb-6">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#444] mb-2">
                    Community Name *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-[#e0e0e0] rounded-[10px] text-[15px] font-inherit bg-[#f9f9f9] transition-all duration-200 box-border focus:outline-none focus:border-[#00c7b7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,199,183,0.1)]"
                    defaultValue={editingCommunity.name}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#444] mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full p-3 border border-[#e0e0e0] rounded-[10px] text-[15px] font-inherit bg-[#f9f9f9] transition-all duration-200 box-border focus:outline-none focus:border-[#00c7b7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,199,183,0.1)] resize-y min-h-[120px]"
                    defaultValue={editingCommunity.description}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                  onClick={() => {
                    setShowEditCommunity(false);
                    setEditingCommunity(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00c7b7] text-white px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditPost && editingPost && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => {
            setShowEditPost(false);
            setEditingPost(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[600px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">Edit Post</h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => {
                  setShowEditPost(false);
                  setEditingPost(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdatePost}>
              <div className="mb-6">
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-[#444] mb-2">
                    Post Content *
                  </label>
                  <textarea
                    className="w-full p-3 border border-[#e0e0e0] rounded-[10px] text-[15px] font-inherit bg-[#f9f9f9] transition-all duration-200 box-border focus:outline-none focus:border-[#00c7b7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,199,183,0.1)] resize-y min-h-[150px]"
                    value={editPostContent}
                    onChange={(e) => setEditPostContent(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                  onClick={() => {
                    setShowEditPost(false);
                    setEditingPost(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00c7b7] text-white px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)]"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembers && selectedCommunityForMembers && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => {
            setShowMembers(false);
            setSelectedCommunityForMembers(null);
          }}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[800px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">
                Members - {selectedCommunityForMembers.name}
              </h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => {
                  setShowMembers(false);
                  setSelectedCommunityForMembers(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              {/* Add Member Button */}
              <div className="mb-5">
                <button
                  className="bg-[#00c7b7] text-white px-4 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#009e8e] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,199,183,0.3)] flex items-center gap-2"
                  onClick={() => alert("Add member functionality")}
                >
                  <FiUserPlus /> Add Member
                </button>
              </div>

              {/* Members List */}
              <div className="grid gap-3">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 bg-[#f9f9f9] rounded-[10px] flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#00c7b7] flex items-center justify-center text-white font-bold">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-[15px]">{member.name}</div>
                        <div className="text-[13px] text-[#888]">Joined: {member.joined}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1.5 rounded-[20px] text-xs font-semibold ${
                          member.role === "Admin"
                            ? "bg-[#00c7b715] text-[#00c7b7]"
                            : "bg-[#f9f9f9] text-[#666]"
                        }`}
                      >
                        {member.role}
                      </span>
                      <button
                        onClick={() => {
                          setShowActivityLog(true);
                        }}
                        className="bg-transparent border-none text-[#00c7b7] cursor-pointer text-sm flex items-center gap-1.5"
                        title="View Activity Log"
                      >
                        <FiActivity /> Activity
                      </button>
                      {member.role !== "Admin" && (
                        <button
                          onClick={() => alert("Edit member functionality")}
                          className="bg-transparent border-none text-[#f39c12] cursor-pointer text-sm"
                          title="Edit Member"
                        >
                          <FiEdit />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                onClick={() => {
                  setShowMembers(false);
                  setSelectedCommunityForMembers(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivityLog && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-[fadeInOverlay_0.3s_ease-out]"
          onClick={() => setShowActivityLog(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-[700px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideInModal_0.4s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#222] m-0">Activity Log</h3>
              <button
                className="bg-transparent border-none text-[28px] text-[#888] cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-[#f0f0f0]"
                onClick={() => setShowActivityLog(false)}
              >
                ×
              </button>
            </div>
            <div className="mb-6">
              <div className="grid gap-4">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 bg-[#f9f9f9] rounded-[10px] flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-[15px]">{activity.action}</div>
                      <div className="text-[13px] text-[#888]">{activity.date}</div>
                    </div>
                    <span className="px-3 py-1.5 bg-[#00c7b715] rounded-[20px] text-xs font-semibold text-[#00c7b7] capitalize">
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="bg-[#f0f0f0] text-[#666] px-7 py-3 rounded-[10px] text-[15px] font-semibold cursor-pointer transition-all duration-200 border-none font-inherit hover:bg-[#e0e0e0]"
                onClick={() => setShowActivityLog(false)}
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

export default Community;

