import React from "react";
import NoteCard from "./NoteCard";
import "../../styles/notes/NoteList.css";

const NoteList = ({ notes, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return <div className="note-list-loading">Loading notes...</div>;
  }

  if (error) {
    return <div className="note-list-error">{error}</div>;
  }

  if (!notes || notes.length === 0) {
    return <div className="note-list-empty">No notes added yet. Add your first note above!</div>;
  }

  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default NoteList;
