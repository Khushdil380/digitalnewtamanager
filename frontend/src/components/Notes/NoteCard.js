import React from "react";
import { formatDateTime } from "../../utils/formatDate";
import "../../styles/notes/NoteCard.css";

const NoteCard = ({ note, onEdit, onDelete }) => {
  return (
    <div className="note-card">
      <div className="note-card-content">
        <h4 className="note-title">{note.title}</h4>
        <p className="note-description">{note.description}</p>
        <span className="note-timestamp">Updated: {formatDateTime(note.updatedAt)}</span>
      </div>
      <div className="note-card-actions">
        <button className="note-edit-btn" onClick={() => onEdit(note)} title="Edit">✏️</button>
        <button className="note-delete-btn" onClick={() => onDelete(note)} title="Delete">🗑️</button>
      </div>
    </div>
  );
};

export default NoteCard;
