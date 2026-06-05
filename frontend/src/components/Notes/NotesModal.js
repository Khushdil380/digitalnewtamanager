import React, { useState, useEffect, useCallback } from "react";
import Modal from "../common/Modal";
import InputField from "../common/InputField";
import Button from "../common/Button";
import NoteList from "./NoteList";
import api from "../../utils/api";
import "../../styles/notes/NotesModal.css";

const NotesModal = ({ isOpen, onClose, weddingId }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!weddingId) return;
    try {
      setListLoading(true);
      setListError("");
      const res = await api.get(`/api/notes/${weddingId}`);
      setNotes(res.data.notes || []);
    } catch (err) {
      setListError("Could not load notes. Please try again.");
    } finally {
      setListLoading(false);
    }
  }, [weddingId]);

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, fetchNotes]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingNote(null);
    setError("");
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();

    if (!trimmedTitle || !trimmedDesc) {
      setError("Both title and description are required.");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Title must be 100 characters or less.");
      return;
    }

    if (trimmedDesc.length > 500) {
      setError("Description must be 500 characters or less.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (editingNote) {
        const res = await api.put(`/api/notes/${editingNote._id}`, {
          title: trimmedTitle,
          description: trimmedDesc,
        });
        setNotes((prev) =>
          prev.map((n) => (n._id === editingNote._id ? res.data.note : n))
        );
      } else {
        const res = await api.post("/api/notes", {
          weddingId,
          title: trimmedTitle,
          description: trimmedDesc,
        });
        setNotes((prev) => [res.data.note, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(editingNote ? "Failed to update note." : "Failed to save note.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setDescription(note.description);
    setError("");
  };

  const handleDelete = (note) => {
    setDeleteConfirm(note);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/api/notes/${deleteConfirm._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== deleteConfirm._id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete note.");
      setDeleteConfirm(null);
    }
  };

  const handleClose = () => {
    resetForm();
    setDeleteConfirm(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="large">
      <div className="notes-modal">
        <h2 className="notes-modal-title">📝 Notes</h2>

        <div className="notes-form">
          <InputField
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
          <InputField
            placeholder="Note description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
          />
          <div className="notes-form-actions">
            <Button size="small" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "..." : editingNote ? "Update" : "Add"}
            </Button>
            {editingNote && (
              <Button size="small" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {error && <p className="notes-error">{error}</p>}

        <div className="notes-list-section">
          <NoteList
            notes={notes}
            loading={listLoading}
            error={listError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <div className="notes-confirm-overlay">
            <div className="notes-confirm-box">
              <p>Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?</p>
              <div className="notes-confirm-actions">
                <Button variant="primary" onClick={confirmDelete}>Yes, Delete</Button>
                <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotesModal;
