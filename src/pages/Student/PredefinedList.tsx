import React, { useState } from "react";
import { FiPlus, FiEdit, FiEye, FiFilter } from "react-icons/fi";

// TypeScript interfaces
interface PredefinedList {
  id: number;
  name: string;
  description: string;
  category: string;
  itemCount: number;
  createdDate: string;
  lastUpdated: string;
  items: string[];
  status: string;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  items: string[];
}

const PredefinedList: React.FC = () => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showOverview, setShowOverview] = useState<boolean>(false);
  const [selectedList, setSelectedList] = useState<PredefinedList | null>(null);
  const [editingList, setEditingList] = useState<PredefinedList | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "",
    items: [],
  });
  const [newItem, setNewItem] = useState<string>("");

  // Static predefined lists data
  const predefinedLists: PredefinedList[] = [
    {
      id: 1,
      name: "Gratitude List",
      description: "Things I'm grateful for today",
      category: "Wellness",
      itemCount: 5,
      createdDate: "2024-01-10",
      lastUpdated: "2024-01-15",
      items: [
        "Family support",
        "Good health",
        "Friends",
        "Education",
        "Nature",
      ],
      status: "active",
    },
    {
      id: 2,
      name: "Coping Strategies",
      description: "Strategies that help me manage stress",
      category: "Mental Health",
      itemCount: 8,
      createdDate: "2024-01-05",
      lastUpdated: "2024-01-14",
      items: [
        "Deep breathing",
        "Meditation",
        "Exercise",
        "Talking to friends",
        "Listening to music",
        "Reading",
        "Journaling",
        "Taking breaks",
      ],
      status: "active",
    },
    {
      id: 3,
      name: "Daily Affirmations",
      description: "Positive affirmations for daily use",
      category: "Self-Care",
      itemCount: 10,
      createdDate: "2024-01-01",
      lastUpdated: "2024-01-12",
      items: [
        "I am capable",
        "I am worthy",
        "I am resilient",
        "I am growing",
        "I am enough",
        "I am strong",
        "I am loved",
        "I am valued",
        "I am creative",
        "I am at peace",
      ],
      status: "active",
    },
    {
      id: 4,
      name: "Self-Care Activities",
      description: "Activities that help me recharge",
      category: "Self-Care",
      itemCount: 6,
      createdDate: "2024-01-08",
      lastUpdated: "2024-01-13",
      items: [
        "Take a warm bath",
        "Read a book",
        "Go for a walk",
        "Practice yoga",
        "Listen to podcasts",
        "Cook a favorite meal",
      ],
      status: "active",
    },
  ];

  const categories = [
    "Wellness",
    "Mental Health",
    "Self-Care",
    "Goals",
    "Other",
  ];

  const handleCreateList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    alert("Predefined list created successfully!");
    setShowCreateModal(false);
    setFormData({ name: "", description: "", category: "", items: [] });
  };

  const handleEditList = (list: PredefinedList) => {
    setEditingList(list);
    setFormData({
      name: list.name,
      description: list.description,
      category: list.category,
      items: list.items,
    });
    setShowEditModal(true);
  };

  const handleUpdateList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    alert("Predefined list updated successfully!");
    setShowEditModal(false);
    setEditingList(null);
    setFormData({ name: "", description: "", category: "", items: [] });
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData({
        ...formData,
        items: [...formData.items, newItem.trim()],
      });
      setNewItem("");
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold m-0">Predefined Lists</h2>
          <p className="text-gray-500 mt-1.5 text-sm">
            Manage your predefined lists for quick access
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </button>
          <button
            className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors flex items-center gap-2"
            onClick={() => {
              setFormData({ name: "", description: "", category: "", items: [] });
              setShowCreateModal(true);
            }}
          >
            <FiPlus /> Create List
          </button>
        </div>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-slate-200/80">
          <div className="text-base font-semibold mb-4 text-gray-700">
            Filter Lists
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent">
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors">
              Apply Filters
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {predefinedLists.map((list) => (
          <div
            key={list.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/80 flex flex-col"
          >
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold m-0 text-slate-900">
                  {list.name}
                </h3>
                <span className="px-3 py-1 bg-[#1ecab8]/15 rounded-full text-[11px] font-semibold text-[#1ecab8] uppercase">
                  {list.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                {list.description}
              </p>
              <div className="flex gap-3 text-xs text-gray-500">
                <span>{list.category}</span>
                <span>•</span>
                <span>{list.itemCount} items</span>
              </div>
            </div>

            {/* Preview Items */}
            <div className="flex-1 mb-4 p-3 bg-gray-50 rounded-lg max-h-[120px] overflow-y-auto">
              <div className="text-xs text-gray-500 mb-2">Items:</div>
              <div className="flex flex-wrap gap-1.5">
                {list.items.slice(0, 3).map((item, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600"
                  >
                    {item}
                  </span>
                ))}
                {list.items.length > 3 && (
                  <span className="px-2.5 py-1 bg-white rounded-md text-xs text-gray-600">
                    +{list.items.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedList(list);
                  setShowOverview(true);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <FiEye /> View
              </button>
              <button
                onClick={() => handleEditList(list)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <FiEdit /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Create Predefined List
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateList}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    List Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Gratitude List"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent min-h-[80px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the purpose of this list..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Items *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem();
                        }
                      }}
                      placeholder="Add an item..."
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      onClick={handleAddItem}
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="bg-transparent border-none text-red-600 cursor-pointer text-lg hover:text-red-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {formData.items.length === 0 && (
                    <div className="text-xs text-gray-500 italic">
                      No items added yet. Add at least one item.
                    </div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formData.items.length === 0}
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingList && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => {
            setShowEditModal(false);
            setEditingList(null);
          }}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                Edit Predefined List
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingList(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateList}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    List Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent min-h-[80px]"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Items *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1ecab8] focus:border-transparent"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddItem();
                        }
                      }}
                      placeholder="Add an item..."
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      onClick={handleAddItem}
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="bg-transparent border-none text-red-600 cursor-pointer text-lg hover:text-red-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingList(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={formData.items.length === 0}
                >
                  Update List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Overview Modal */}
      {showOverview && selectedList && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in-overlay"
          onClick={() => {
            setShowOverview(false);
            setSelectedList(null);
          }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl animate-slide-in-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900">
                {selectedList.name} - Overview
              </h3>
              <button
                className="text-2xl text-slate-500 hover:text-slate-900 transition-colors"
                onClick={() => {
                  setShowOverview(false);
                  setSelectedList(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <div className="text-xs text-gray-500 mb-2 uppercase">
                    Description
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {selectedList.description}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Category</div>
                    <div className="text-base font-bold text-[#1ecab8]">
                      {selectedList.category}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Items</div>
                    <div className="text-base font-bold text-[#1ecab8]">
                      {selectedList.itemCount}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Status</div>
                    <div className="text-base font-bold text-[#1ecab8] capitalize">
                      {selectedList.status}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Created</div>
                    <div className="text-sm font-semibold">
                      {selectedList.createdDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                    <div className="text-sm font-semibold">
                      {selectedList.lastUpdated}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <div className="text-base font-semibold mb-3">
                    All Items ({selectedList.items.length})
                  </div>
                  <div className="space-y-2">
                    {selectedList.items.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg flex items-center gap-3"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#1ecab8] text-white flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setShowOverview(false);
                  setSelectedList(null);
                }}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-[#1ecab8] text-white rounded-lg font-medium hover:bg-[#1bb8a6] transition-colors"
                onClick={() => {
                  setShowOverview(false);
                  handleEditList(selectedList);
                }}
              >
                Edit List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredefinedList;

