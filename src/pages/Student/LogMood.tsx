import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import axios from "axios";
import API_BASE_URL from "../../config/api";

interface FormData {
  feelingDescription: string;
  subCategory: string;
  subCategoryId: number | null;
  category: string;
  categoryId: number | null;
  addNote: string;
  pleasantness: number;
  impact: number;
  emotion: string;
  calculatedEmotion: string;
  calculatedZone: string;
  date: string;
  time: string;
}

interface Mood {
  id?: number;
  name?: string;
  emotion?: {
    name: string;
  };
  zone?: {
    name: string;
    description?: string;
  };
  status?: boolean;
}

interface SubCategory {
  id: number;
  name: string;
  status: boolean;
  category?: {
    id: number;
    name: string;
  };
  categoryId?: number;
}

interface Category {
  id: number;
  name: string;
  status: boolean;
}

interface Emotion {
  id: number;
  name: string;
  status: boolean;
}

interface Zone {
  id: number;
  name: string;
  status: boolean;
}

interface AutocompleteSuggestion {
  mood: string;
  description: string;
  emotion: string;
  zone: string;
}

interface EmotionZoneResult {
  calculatedEmotion: string;
  calculatedZone: string;
}

const LogMood: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    feelingDescription: "",
    subCategory: "",
    subCategoryId: null,
    category: "",
    categoryId: null,
    addNote: "",
    // Default to mid‑point on a 1–10 scale
    pleasantness: 5,
    impact: 5,
    emotion: "",
    calculatedEmotion: "",
    calculatedZone: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    AutocompleteSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loadingMoods, setLoadingMoods] = useState(false);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [subCategorySuggestions, setSubCategorySuggestions] = useState<
    SubCategory[]
  >([]);
  const [showSubCategorySuggestions, setShowSubCategorySuggestions] =
    useState(false);
  const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(-1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubCategoryData, setSelectedSubCategoryData] =
    useState<SubCategory | null>(null);
  const [showCategorySelection, setShowCategorySelection] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const subCategoryInputRef = useRef<HTMLInputElement>(null);
  const subCategorySuggestionsRef = useRef<HTMLDivElement>(null);

  const SERVER_URL = `${API_BASE_URL}/moods`;
  const SUB_CATEGORY_URL = `${API_BASE_URL}/subcategories`;
  const CATEGORY_URL = `${API_BASE_URL}/categories`;
  const EMOTION_URL = `${API_BASE_URL}/emotions`;
  const ZONE_URL = `${API_BASE_URL}/zones`;

  // Fetch moods from API
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        setLoadingMoods(true);
        const response = await axios.get(`${SERVER_URL}`, {
          params: {
            status: "true",
          },
        });
        if (response.data) {
          setMoods(response.data);
        }
      } catch (err) {
        console.error("Error fetching moods:", err);
        setMoods([]);
      } finally {
        setLoadingMoods(false);
      }
    };

    fetchMoods();
  }, []);

  // Fetch subcategories from API
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoadingSubCategories(true);
        const response = await axios.get(`${SUB_CATEGORY_URL}`);
        if (response.data) {
          const activeSubCategories = response.data.filter(
            (subCat: SubCategory) => subCat.status === true
          );
          setSubCategories(activeSubCategories);
        }
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    };

    fetchSubCategories();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${CATEGORY_URL}`);
        if (response.data) {
          const activeCategories = response.data.filter(
            (cat: Category) => cat.status === true
          );
          setCategories(activeCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Fetch emotions and zones for calculation
  useEffect(() => {
    const fetchEmotionsAndZones = async () => {
      try {
        const [emotionsRes, zonesRes] = await Promise.all([
          axios.get(`${EMOTION_URL}`),
          axios.get(`${ZONE_URL}`),
        ]);
        if (emotionsRes.data) {
          setEmotions(
            emotionsRes.data.filter((e: Emotion) => e.status === true)
          );
        }
        if (zonesRes.data) {
          setZones(zonesRes.data.filter((z: Zone) => z.status === true));
        }
      } catch (err) {
        console.error("Error fetching emotions/zones:", err);
      }
    };

    fetchEmotionsAndZones();
  }, []);

  // Get pleasantness label
  const getPleasantnessLabel = (value: number): string => {
    if (value <= 2) return "Very Low";
    if (value <= 3) return "Low";
    if (value <= 5) return "Moderate";
    if (value <= 6) return "High";
    return "Very High";
  };

  // Get impact label
  const getImpactLabel = (value: number): string => {
    if (value <= 2) return "Very Low";
    if (value <= 3) return "Low";
    if (value <= 5) return "Moderate";
    if (value <= 6) return "High";
    return "Very High";
  };

  // Handle feeling description input change
  const handleFeelingDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData({ ...formData, feelingDescription: value });

    if (value.trim().length > 0 && moods.length > 0) {
      const filtered = moods
        .filter(
          (mood) =>
            mood.name?.toLowerCase().includes(value.toLowerCase()) ||
            mood.emotion?.name?.toLowerCase().includes(value.toLowerCase()) ||
            mood.zone?.description
              ?.toLowerCase()
              .includes(value.toLowerCase()) ||
            mood.zone?.name?.toLowerCase().includes(value.toLowerCase())
        )
        .map((mood) => ({
          mood: mood.name || "",
          description: mood.zone?.description || mood.zone?.name || "",
          emotion: mood.emotion?.name || "",
          zone: mood.zone?.name || "",
        }));

      setAutocompleteSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setAutocompleteSuggestions([]);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (mood: AutocompleteSuggestion) => {
    setFormData({
      ...formData,
      feelingDescription: mood.mood,
    });
    setShowSuggestions(false);
    setAutocompleteSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions || autocompleteSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < autocompleteSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(autocompleteSuggestions[selectedSuggestionIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        textareaRef.current &&
        !textareaRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
      if (
        subCategorySuggestionsRef.current &&
        !subCategorySuggestionsRef.current.contains(event.target as Node) &&
        subCategoryInputRef.current &&
        !subCategoryInputRef.current.contains(event.target as Node)
      ) {
        setShowSubCategorySuggestions(false);
        setSelectedSubCategoryIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle subcategory input change
  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Reset subCategoryId when user types
    setFormData({
      ...formData,
      subCategory: value,
      subCategoryId: null,
    });

    if (value.trim().length > 0 && subCategories.length > 0) {
      const filtered = subCategories.filter((subCat) => {
        const matchesName = subCat.name
          ?.toLowerCase()
          .includes(value.toLowerCase());

        // If a main category is selected, restrict sub categories to that category
        if (formData.categoryId) {
          const subCatCategoryId =
            subCat.category?.id ?? subCat.categoryId ?? null;
          return matchesName && subCatCategoryId === formData.categoryId;
        }

        return matchesName;
      });

      setSubCategorySuggestions(filtered.slice(0, 5));
      setShowSubCategorySuggestions(filtered.length > 0);
      setSelectedSubCategoryIndex(-1);
    } else {
      setShowSubCategorySuggestions(false);
      setSubCategorySuggestions([]);
      setSelectedSubCategoryIndex(-1);
    }
  };

  const handleCategorySelect = (category: Category) => {
    // When main category changes, clear any selected sub category and related note
    setFormData((prev) => ({
      ...prev,
      category: category.name,
      categoryId: category.id,
      subCategory: "",
      subCategoryId: null,
      addNote: "",
    }));
    setSelectedSubCategoryData(null);
    setSubCategorySuggestions([]);
    setShowSubCategorySuggestions(false);
    setSelectedSubCategoryIndex(-1);
  };

  // Handle subcategory suggestion selection
  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setSelectedSubCategoryData(subCategory);
    setShowSubCategorySuggestions(false);
    setSubCategorySuggestions([]);
    setSelectedSubCategoryIndex(-1);

    let categoryName = "";
    let categoryId: number | null = null;

    if (subCategory.category) {
      categoryName = subCategory.category.name;
      categoryId = subCategory.category.id;
      setSelectedCategories([subCategory.category.id]);
    } else if (subCategory.categoryId) {
      const category = categories.find((c) => c.id === subCategory.categoryId);
      if (category) {
        categoryName = category.name;
        categoryId = category.id;
        setSelectedCategories([category.id]);
      }
    }

    setFormData((prev) => ({
      ...prev,
      subCategory: subCategory.name,
      subCategoryId: subCategory.id,
      category: categoryName,
      categoryId: categoryId,
      addNote: "",
    }));
  };

  // Handle keyboard navigation for subcategory
  const handleSubCategoryKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!showSubCategorySuggestions || subCategorySuggestions.length === 0)
      return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSubCategoryIndex((prev) =>
        prev < subCategorySuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSubCategoryIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedSubCategoryIndex >= 0) {
      e.preventDefault();
      handleSubCategorySelect(subCategorySuggestions[selectedSubCategoryIndex]);
    } else if (e.key === "Escape") {
      setShowSubCategorySuggestions(false);
      setSelectedSubCategoryIndex(-1);
    }
  };

  // Helper function to get color for emotion
  const getEmotionColor = (emotion?: string): string => {
    const emotionColors: Record<string, string> = {
      Sad: "#3b82f6",
      Calm: "#10b981",
      Angry: "#ef4444",
      Joy: "#10b981",
      Complacent: "#f59e0b",
      Happy: "#10b981",
      Anxious: "#f59e0b",
      Stressed: "#f97316",
    };
    return emotionColors[emotion || ""] || "#6b7280";
  };

  // Helper function to get color for zone
  const getZoneColor = (zone?: string): string => {
    const zoneColors: Record<string, string> = {
      Green: "#10b981",
      Yellow: "#f59e0b",
      Brown: "#8b4513",
      "Light Red": "#ff6b6b",
      "Dark Red": "#dc2626",
      Blue: "#3b82f6",
    };
    return zoneColors[zone || ""] || "#6b7280";
  };

  // Calculate emotion and zone based on impact and pleasantness
  const calculateEmotionAndZone = (
    impact: number,
    pleasantness: number
  ): EmotionZoneResult => {
    // Internal lookup is defined for 1–7, but UI can use 1–10.
    const mapToSevenPointScale = (value: number) => {
      const scaled = Math.round((value / 10) * 7);
      return Math.min(7, Math.max(1, scaled || 1));
    };

    const impactScale = mapToSevenPointScale(impact);
    const pleasantnessScale = mapToSevenPointScale(pleasantness);

    const emotionZoneLookup: Record<string, EmotionZoneResult> = {
      "1-1": { calculatedEmotion: "Depressed", calculatedZone: "Light Red" },
      "1-2": { calculatedEmotion: "Discouraged", calculatedZone: "Light Red" },
      "1-3": { calculatedEmotion: "Exhausted", calculatedZone: "Brown" },
      "1-4": { calculatedEmotion: "Uneasy", calculatedZone: "Yellow" },
      "1-5": { calculatedEmotion: "Relaxed", calculatedZone: "Green" },
      "1-6": { calculatedEmotion: "Comfortable", calculatedZone: "Green" },
      "1-7": { calculatedEmotion: "Serene", calculatedZone: "Green" },
      "2-1": { calculatedEmotion: "Lonely", calculatedZone: "Light Red" },
      "2-2": { calculatedEmotion: "Miserable", calculatedZone: "Light Red" },
      "2-3": { calculatedEmotion: "Tired", calculatedZone: "Brown" },
      "2-4": { calculatedEmotion: "Bored", calculatedZone: "Yellow" },
      "2-5": { calculatedEmotion: "Thoughtful", calculatedZone: "Green" },
      "2-6": { calculatedEmotion: "Hopeful", calculatedZone: "Green" },
      "2-7": { calculatedEmotion: "Carefree", calculatedZone: "Green" },
      "3-1": { calculatedEmotion: "Frightened", calculatedZone: "Light Red" },
      "3-2": { calculatedEmotion: "Worried", calculatedZone: "Light Red" },
      "3-3": { calculatedEmotion: "Concerned", calculatedZone: "Brown" },
      "3-4": { calculatedEmotion: "Complacent", calculatedZone: "Yellow" },
      "3-5": { calculatedEmotion: "Focused", calculatedZone: "Green" },
      "3-6": { calculatedEmotion: "Peaceful", calculatedZone: "Green" },
      "3-7": { calculatedEmotion: "Touched", calculatedZone: "Green" },
      "4-1": { calculatedEmotion: "Disgusted", calculatedZone: "Dark Red" },
      "4-2": { calculatedEmotion: "Angry", calculatedZone: "Dark Red" },
      "4-3": { calculatedEmotion: "Disappointed", calculatedZone: "Brown" },
      "4-4": { calculatedEmotion: "Satisfied", calculatedZone: "Yellow" },
      "4-5": { calculatedEmotion: "Optimistic", calculatedZone: "Blue" },
      "4-6": { calculatedEmotion: "Joyful", calculatedZone: "Blue" },
      "4-7": { calculatedEmotion: "Grateful", calculatedZone: "Blue" },
      "5-1": { calculatedEmotion: "Fuming", calculatedZone: "Dark Red" },
      "5-2": { calculatedEmotion: "Frustrated", calculatedZone: "Dark Red" },
      "5-3": { calculatedEmotion: "Irritated", calculatedZone: "Brown" },
      "5-4": { calculatedEmotion: "Energized", calculatedZone: "Yellow" },
      "5-5": { calculatedEmotion: "Cheerful", calculatedZone: "Blue" },
      "5-6": { calculatedEmotion: "Proud", calculatedZone: "Blue" },
      "5-7": { calculatedEmotion: "Blissful", calculatedZone: "Blue" },
      "6-1": { calculatedEmotion: "Furious", calculatedZone: "Dark Red" },
      "6-2": { calculatedEmotion: "Nervous", calculatedZone: "Dark Red" },
      "6-3": { calculatedEmotion: "Restless", calculatedZone: "Brown" },
      "6-4": { calculatedEmotion: "Lively", calculatedZone: "Yellow" },
      "6-5": { calculatedEmotion: "Enthusiastic", calculatedZone: "Blue" },
      "6-6": { calculatedEmotion: "Motivated", calculatedZone: "Blue" },
      "6-7": { calculatedEmotion: "Thrilled", calculatedZone: "Blue" },
      "7-1": { calculatedEmotion: "Enraged", calculatedZone: "Dark Red" },
      "7-2": { calculatedEmotion: "Panicked", calculatedZone: "Dark Red" },
      "7-3": { calculatedEmotion: "Shocked", calculatedZone: "Brown" },
      "7-4": { calculatedEmotion: "Hyper", calculatedZone: "Yellow" },
      "7-5": { calculatedEmotion: "Surprised", calculatedZone: "Blue" },
      "7-6": { calculatedEmotion: "Inspired", calculatedZone: "Blue" },
      "7-7": { calculatedEmotion: "Exhilarated", calculatedZone: "Blue" },
    };

    const key = `${impactScale}-${pleasantnessScale}`;
    const result = emotionZoneLookup[key];

    if (result) {
      return result;
    }

    return {
      calculatedEmotion: "Unknown",
      calculatedZone: "Yellow",
    };
  };

  // Update calculated emotion/zone when impact or joyfulness changes
  useEffect(() => {
    const { calculatedEmotion, calculatedZone } = calculateEmotionAndZone(
      formData.impact,
      formData.pleasantness
    );
    setFormData((prev) => ({
      ...prev,
      calculatedEmotion,
      calculatedZone,
    }));
  }, [formData.impact, formData.pleasantness]);

  const handleSubmit = () => {
    if (!formData.categoryId) {
      alert("Please select a main category");
      return;
    }
    if (!formData.subCategoryId && !formData.addNote.trim()) {
      alert("Please select a sub category or add a note");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      const existingMood = moods.find(
        (mood) =>
          mood.name?.toLowerCase() ===
          formData.feelingDescription.trim().toLowerCase()
      );

      let moodToUse = formData.feelingDescription;

      if (!existingMood && formData.feelingDescription.trim()) {
        try {
          const defaultEmotion =
            emotions.find((e) => e.name === formData.calculatedEmotion) ||
            emotions[0];
          const defaultZone =
            zones.find((z) => z.name === formData.calculatedZone) || zones[0];

          const newMoodData = {
            name: formData.feelingDescription.trim(),
            code: `CUSTOM_${Date.now().toString().slice(-8)}`,
            emotionId: defaultEmotion ? defaultEmotion.id : 1,
            zoneId: defaultZone ? defaultZone.id : 1,
            status: false, // Set to false (pending) for admin review
          };

          await axios.post(`${SERVER_URL}`, newMoodData);
          console.log("Custom mood added to master data with pending status");
        } catch (moodError) {
          console.error("Error creating mood in master data:", moodError);
        }
      }

      const moodLogData = {
        studentId: 1,
        date: formData.date,
        time: formData.time,
        feelingDescription: moodToUse,
        categoryId: formData.categoryId || null,
        subCategoryId: formData.subCategoryId || null,
        addNote: formData.addNote || "",
        impact: formData.impact,
        joyfulness: formData.pleasantness,
        calculatedEmotion: formData.calculatedEmotion,
        calculatedZone: formData.calculatedZone,
        status: true,
      };

      console.log("Submitting mood log data:", moodLogData);

      const response = await axios.post(
        `${API_BASE_URL}/student-mood-logs`,
        moodLogData
      );

      if (response.status === 201) {
        if (!existingMood && formData.feelingDescription.trim()) {
          alert(
            "Mood logged successfully! Your custom mood has been submitted to admin for review."
          );
        } else {
          alert("Mood logged successfully!");
        }
        navigate("/student/mood-history");
      }
    } catch (error: any) {
      console.error("Error submitting mood log:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to log mood. Please try again.";
      alert(
        `Error: ${errorMessage}\n\nPlease make sure the backend server is restarted.`
      );
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#fafbfc",
        minHeight: "100vh",
        fontFamily:
          '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        maxWidth: "1600px",
        margin: "0 auto",
      }}
    >
      {/* Custom styles for slider gradient and modal animations */}
      <style>{`
        .slider-gradient {
          width: 100%;
          height: 12px;
          border-radius: 6px;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(
            to right,
            #8B0000 0%,
            #FF4500 20%,
            #FFA500 35%,
            #90EE90 50%,
            #87CEEB 65%,
            #4169E1 85%,
            #00008B 100%
          );
        }
        .slider-gradient::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 2px solid #3498db;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        .slider-gradient::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .slider-gradient::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          border: 2px solid #3498db;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        .slider-gradient::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInModal {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .modal-overlay-custom {
          animation: fadeInOverlay 0.3s ease-out;
        }
        .modal-custom {
          animation: slideInModal 0.4s ease-out;
        }
      `}</style>
      {/* Main Form Container */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Title */}
        <h2 className="text-[28px] font-bold m-0 mb-8 text-[#222]">
          What are you feeling right now?
        </h2>

        {/* Date and Time Display */}
        <div className="flex gap-4 mb-6 text-sm text-[#666]">
          <div>
            <strong>Date:</strong> {formData.date}
          </div>
          <div>
            <strong>Time:</strong> {formData.time}
          </div>
        </div>

        {/* Feeling Description Input */}
        <div style={{ marginBottom: "28px", position: "relative" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "8px",
            }}
          >
            How are you feeling? (Select from suggestions or type your own)
          </label>
          <textarea
            ref={textareaRef}
            placeholder="Type how you feel right now... (e.g., 'Happy - Feeling joyful today' or create your own description)"
            value={formData.feelingDescription}
            onChange={handleFeelingDescriptionChange}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              fontSize: "16px",
              fontFamily: "inherit",
              background: "#f9f9f9",
              transition: "all 0.2s",
              boxSizing: "border-box",
              resize: "vertical",
              minHeight: "120px",
              fontStyle: formData.feelingDescription ? "normal" : "italic",
              color: formData.feelingDescription ? "#222" : "#999",
            }}
            onFocus={(e) => {
              e.target.style.outline = "none";
              e.target.style.borderColor = "#00c7b7";
              e.target.style.background = "#fff";
              e.target.style.boxShadow = "0 0 0 3px rgba(0, 199, 183, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e0e0e0";
              e.target.style.background = "#f9f9f9";
              e.target.style.boxShadow = "none";
            }}
          />
          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && autocompleteSuggestions.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-white border border-[#e0e0e0] rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000] mt-1 max-h-[300px] overflow-y-auto"
            >
              <div className="p-2 px-4 bg-[#f9f9f9] border-b border-[#e0e0e0] text-xs text-[#666] font-semibold">
                Suggested Moods (or keep typing to create your own)
              </div>
              {autocompleteSuggestions.map((mood, index) => (
                <div
                  key={mood.mood || index}
                  onClick={() => handleSuggestionSelect(mood)}
                  className={`px-4 py-3 cursor-pointer border-b ${
                    index < autocompleteSuggestions.length - 1
                      ? "border-[#f0f0f0]"
                      : "border-none"
                  } transition-colors duration-200 ${
                    index === selectedSuggestionIndex
                      ? "bg-[#f5f5f5]"
                      : "bg-white"
                  }`}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  onMouseLeave={() => setSelectedSuggestionIndex(-1)}
                >
                  <div className="text-[15px] font-semibold text-[#222] leading-snug">
                    {mood.mood}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Helper text */}
          <div className="text-xs text-[#888] mt-1.5 italic">
            💡 Start typing to see suggestions, or create your own custom mood
            description. Custom moods will be reviewed by admin and added to the
            system.
          </div>
        </div>

        {/* Q1: Main Category Selection */}
        <div style={{ marginBottom: "32px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "600",
              color: "#444",
              marginBottom: "8px",
            }}
          >
            What is on the top of your mind today?
          </label>
          <p
            style={{
              fontSize: "12px",
              color: "#777",
              marginBottom: "12px",
              fontStyle: "italic",
            }}
          >
            This will help you understand the emotion you are currently going
            through.
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  formData.categoryId === cat.id
                    ? "bg-[#00c7b7] text-white border-[#00c7b7]"
                    : "bg-white text-[#444] border-[#e0e0e0] hover:border-[#00c7b7]"
                }`}
                style={{
                  cursor: "pointer",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Sub Category Input (only shown after main category is selected) */}
        {formData.categoryId && (
          <div style={{ marginBottom: "32px", position: "relative" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              Sub category (auto-suggested)
            </label>
            <input
              ref={subCategoryInputRef}
              type="text"
              placeholder="e.g., Outing With Family, Play With Family"
              value={formData.subCategory}
              onChange={handleSubCategoryChange}
              onKeyDown={handleSubCategoryKeyDown}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                fontSize: "15px",
                fontFamily: "inherit",
                background: "#f9f9f9",
                transition: "all 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#00c7b7";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 199, 183, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.background = "#f9f9f9";
                e.target.style.boxShadow = "none";
              }}
            />
            {/* Subcategory Autocomplete Suggestions Dropdown */}
            {showSubCategorySuggestions &&
              subCategorySuggestions.length > 0 && (
                <div
                  ref={subCategorySuggestionsRef}
                  className="absolute top-full left-0 right-0 bg-white border border-[#e0e0e0] rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[1000] mt-1 max-h-[300px] overflow-y-auto"
                >
                  {subCategorySuggestions.map((subCat, index) => (
                    <div
                      key={subCat.id || index}
                      onClick={() => handleSubCategorySelect(subCat)}
                      className={`px-4 py-3 cursor-pointer border-b ${
                        index < subCategorySuggestions.length - 1
                          ? "border-[#f0f0f0]"
                          : "border-none"
                      } transition-colors duration-200 ${
                        index === selectedSubCategoryIndex
                          ? "bg-[#f5f5f5]"
                          : "bg-white"
                      }`}
                      onMouseEnter={() => setSelectedSubCategoryIndex(index)}
                      onMouseLeave={() => setSelectedSubCategoryIndex(-1)}
                    >
                      <div className="text-[15px] font-semibold text-[#222] leading-snug">
                        {subCat.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        {/* Add Note Field (only shown if subcategory not selected and category is selected) */}
        {formData.categoryId && !formData.subCategoryId && (
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#444",
                marginBottom: "8px",
              }}
            >
              Add note (if sub category doesn't apply)
            </label>
            <textarea
              placeholder="Explain your mood in more detail..."
              value={formData.addNote}
              onChange={(e) =>
                setFormData({ ...formData, addNote: e.target.value })
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #e0e0e0",
                borderRadius: "10px",
                fontSize: "14px",
                fontFamily: "inherit",
                background: "#f9f9f9",
                transition: "all 0.2s",
                boxSizing: "border-box",
                resize: "vertical",
                minHeight: "100px",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none";
                e.target.style.borderColor = "#00c7b7";
                e.target.style.background = "#fff";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 199, 183, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.background = "#f9f9f9";
                e.target.style.boxShadow = "none";
              }}
            />
            <div
              style={{
                fontSize: "12px",
                color: "#888",
                marginTop: "4px",
                fontStyle: "italic",
              }}
            >
              Note: This will be reviewed by Super Admin to create a new sub
              category if needed.
            </div>
          </div>
        )}

        {/* Q3 & Q4: Sliders - only shown after category and subcategory (or note) are filled */}
        {formData.categoryId &&
          (formData.subCategoryId || formData.addNote.trim()) && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#444] mb-6">
                Can you explain a little more about why you are experiencing
                this emotion?
              </h3>

              {/* Q3: Impact Slider */}
              <div style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    On a scale of 1 to 10 how strongly do you feel about your
                    selection?
                  </label>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    {formData.impact}/10
                  </span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "16px",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "12px",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>Scale:</strong> Rate how strongly you feel about
                    your selection on a scale from 1 to 10, with 1 being the
                    lowest and 10 being the highest.
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.impact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        impact: parseInt(e.target.value, 10),
                      })
                    }
                    className="slider-gradient"
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "8px",
                    }}
                  >
                    <span>1 - Lowest</span>
                    <span>10 - Highest</span>
                  </div>
                </div>
              </div>

              {/* Q4: Pleasantness Slider */}
              <div style={{ marginBottom: "32px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <label
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    On a scale of 1 to 10 how happy do you feel about your
                    selection?
                  </label>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#444",
                    }}
                  >
                    {formData.pleasantness}/10
                  </span>
                </div>
                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "16px",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      marginBottom: "12px",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>Scale:</strong> Rate how happy you feel about your
                    selection on a scale from 1 to 10, with 1 being the lowest
                    and 10 being the highest.
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.pleasantness}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pleasantness: parseInt(e.target.value, 10),
                      })
                    }
                    className="slider-gradient"
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "8px",
                    }}
                  >
                    <span>1 - Lowest</span>
                    <span>10 - Highest</span>
                  </div>
                </div>
              </div>

              {/* Calculated Emotion and Zone Display */}
              {(formData.calculatedEmotion || formData.calculatedZone) && (
                <div className="bg-[#e8f5e9] p-4 rounded-[10px] mt-4">
                  <div className="text-sm text-[#666] mb-3">
                    Calculated based on your Impact and Pleasantness values:
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {formData.calculatedEmotion && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                          style={{
                            backgroundColor: getEmotionColor(
                              formData.calculatedEmotion
                            ),
                          }}
                        />
                        <span className="text-sm font-semibold text-[#222]">
                          {formData.calculatedEmotion}
                        </span>
                      </div>
                    )}
                    {formData.calculatedZone && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                          style={{
                            backgroundColor: getZoneColor(
                              formData.calculatedZone
                            ),
                          }}
                        />
                        <span className="text-sm font-semibold text-[#222]">
                          {formData.calculatedZone}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* Submit Button */}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}
        >
          <button
            onClick={() => navigate("/student/dashboard")}
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              border: "none",
              fontFamily: "inherit",
              background: "#f0f0f0",
              color: "#666",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e0e0e0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f0f0f0";
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              border: "none",
              fontFamily: "inherit",
              background: "#00c7b7",
              color: "#fff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#009e8e";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(0, 199, 183, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#00c7b7";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Submit Mood Log
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="modal-overlay-custom"
          onClick={() => setShowConfirmModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="modal-custom"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "700",
                  color: "#222",
                  margin: 0,
                }}
              >
                Are you want to submit? Please confirm to proceed
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "28px",
                  color: "#888",
                  cursor: "pointer",
                  padding: 0,
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                ×
              </button>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  background: "#f9f9f9",
                  padding: "20px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginBottom: "4px",
                      }}
                    >
                      Feeling Description
                    </div>
                    <div style={{ fontWeight: "600" }}>
                      {formData.feelingDescription || "N/A"}
                    </div>
                  </div>
                  {formData.subCategory && (
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginBottom: "4px",
                        }}
                      >
                        Sub Category
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {formData.subCategory}
                      </div>
                    </div>
                  )}
                  {formData.addNote && (
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginBottom: "4px",
                        }}
                      >
                        Add Note
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {formData.addNote}
                      </div>
                    </div>
                  )}
                  {formData.category && (
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginBottom: "4px",
                        }}
                      >
                        Category
                      </div>
                      <div style={{ fontWeight: "600" }}>
                        {formData.category}
                      </div>
                    </div>
                  )}
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#888",
                        marginBottom: "4px",
                      }}
                    >
                      Impact & Pleasantness
                    </div>
                    <div style={{ fontWeight: "600" }}>
                      Impact: {formData.impact}/10 | Pleasantness:{" "}
                      {formData.pleasantness}/10
                    </div>
                  </div>
                  {(formData.calculatedEmotion || formData.calculatedZone) && (
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#888",
                          marginBottom: "8px",
                        }}
                      >
                        Calculated Emotion & Zone
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          flexWrap: "wrap",
                        }}
                      >
                        {formData.calculatedEmotion && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: getEmotionColor(
                                  formData.calculatedEmotion
                                ),
                                border: "2px solid #fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                            />
                            <span
                              style={{ fontWeight: "600", fontSize: "14px" }}
                            >
                              {formData.calculatedEmotion}
                            </span>
                          </div>
                        )}
                        {formData.calculatedZone && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: getZoneColor(
                                  formData.calculatedZone
                                ),
                                border: "2px solid #fff",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                            />
                            <span
                              style={{ fontWeight: "600", fontSize: "14px" }}
                            >
                              {formData.calculatedZone}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Please review your mood log details before submitting.
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "none",
                  fontFamily: "inherit",
                  background: "#f0f0f0",
                  color: "#666",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0e0e0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "12px 28px",
                  borderRadius: "10px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: "none",
                  fontFamily: "inherit",
                  background: "#00c7b7",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#009e8e";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 199, 183, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#00c7b7";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <FiCheck /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogMood;
