import { useState, useEffect } from "react";
import api from "../../utils/api";

const useGuestList = (weddingId) => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("added");
  const [groupBy, setGroupBy] = useState("none");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guests, searchQuery, sortBy, groupBy]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/guests/wedding/${weddingId}`);
      setGuests(data.guests || []);
      setError("");
    } catch (err) {
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...guests];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((g) =>
        g.name.toLowerCase().includes(query) ||
        g.village.toLowerCase().includes(query) ||
        (g.mobileNumber && g.mobileNumber.includes(query)) ||
        (g.contributionAmount && g.contributionAmount.toString().includes(query))
      );
    }

    switch (sortBy) {
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "priority": result.sort((a, b) => a.priority - b.priority); break;
      case "village": result.sort((a, b) => a.village.localeCompare(b.village)); break;
      case "addedEarlier": result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case "addedWeddingDay": result = result.filter((g) => g.addedOn === "onWeddingDay"); break;
      case "attended": result = result.filter((g) => g.attendedStatus === "attended"); break;
      case "notAttended": result = result.filter((g) => g.attendedStatus !== "attended"); break;
      case "amount": result.sort((a, b) => (b.contributionAmount || 0) - (a.contributionAmount || 0)); break;
      case "upi": result = result.filter((g) => g.contributionType === "online"); break;
      case "cash": result = result.filter((g) => g.contributionType === "cash"); break;
      default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }

    setFilteredGuests(result);
  };

  const deleteGuest = async (guestId) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await api.delete(`/api/guests/${guestId}`);
        setGuests(guests.filter((g) => g._id !== guestId));
      } catch (err) {
        setError("Failed to delete guest");
      }
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("added");
    setGroupBy("none");
  };

  const groupedGuests = () => {
    if (groupBy === "none") return { "All Guests": filteredGuests };
    const grouped = {};
    filteredGuests.forEach((guest) => {
      let key = "Others";
      if (groupBy === "village") key = guest.village;
      else if (groupBy === "tag") key = guest.tag.charAt(0).toUpperCase() + guest.tag.slice(1);
      else if (groupBy === "priority") key = ["High Priority", "Medium Priority", "Low Priority"][guest.priority - 1];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(guest);
    });
    return grouped;
  };

  return {
    guests, filteredGuests, loading, error, user,
    searchQuery, setSearchQuery, sortBy, setSortBy, groupBy, setGroupBy,
    fetchGuests, deleteGuest, clearFilters, groupedGuests,
  };
};

export default useGuestList;
