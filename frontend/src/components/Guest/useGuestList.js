import { useState, useEffect } from "react";
import api from "../../utils/api";

const useGuestList = (weddingId) => {
  const [allGuests, setAllGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("added");
  const [groupBy, setGroupBy] = useState("none");

  const user = JSON.parse(localStorage.getItem("user"));

  // Active guests (not deleted)
  const guests = allGuests.filter((g) => !g.isDeleted);
  const deletedGuests = allGuests.filter((g) => g.isDeleted);

  useEffect(() => {
    fetchGuests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weddingId]);

  useEffect(() => {
    applyFiltersAndSort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGuests, searchQuery, sortBy, groupBy]);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/guests/wedding/${weddingId}`);
      setAllGuests(data.guests || []);
      setError("");
      // Notify WeddingCard to refresh stats
      window.dispatchEvent(new Event("guestListUpdated"));
    } catch (err) {
      setError("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = allGuests.filter((g) => !g.isDeleted);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((g) =>
        g.name.toLowerCase().includes(query) ||
        g.village.toLowerCase().includes(query) ||
        (g.mobileNumber && g.mobileNumber.includes(query)) ||
        (g.amount && g.amount.toString().includes(query))
      );
    }

    switch (sortBy) {
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "priority": result.sort((a, b) => a.priority - b.priority); break;
      case "village": result.sort((a, b) => a.village.localeCompare(b.village)); break;
      case "addedEarlier": result = result.filter((g) => g.addedOn === "earlier"); break;
      case "addedWeddingDay": result = result.filter((g) => g.addedOn === "wedding"); break;
      case "attended": result = result.filter((g) => g.attended === true); break;
      case "notAttended": result = result.filter((g) => g.attended !== true); break;
      case "amount": result.sort((a, b) => (b.amount || 0) - (a.amount || 0)); break;
      case "upi": result = result.filter((g) => g.paymentType === "upi"); break;
      case "cash": result = result.filter((g) => g.paymentType === "cash"); break;
      case "envelope": result = result.filter((g) => g.paymentType === "envelope"); break;
      default: result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
    }

    setFilteredGuests(result);
  };

  const deleteGuest = async (guestId) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await api.delete(`/api/guests/${guestId}`);
        setAllGuests(allGuests.map((g) => g._id === guestId ? { ...g, isDeleted: true, attended: false, amount: 0, paymentType: null, attendedBy: null } : g));
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
      if (groupBy === "village") key = guest.village.charAt(0).toUpperCase() + guest.village.slice(1).toLowerCase();
      else if (groupBy === "tag") key = guest.tag.charAt(0).toUpperCase() + guest.tag.slice(1);
      else if (groupBy === "priority") key = ["High Priority", "Medium Priority", "Low Priority"][guest.priority - 1];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(guest);
    });
    return grouped;
  };

  return {
    guests, filteredGuests, deletedGuests, loading, error, user,
    searchQuery, setSearchQuery, sortBy, setSortBy, groupBy, setGroupBy,
    fetchGuests, deleteGuest, clearFilters, groupedGuests,
  };
};

export default useGuestList;
