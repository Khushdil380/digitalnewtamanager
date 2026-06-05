import Note from "../models/Note.js";

export const createNote = async (req, res) => {
  try {
    const { weddingId, title, description } = req.body;

    if (!weddingId || !title || !description) {
      return res.status(400).json({ success: false, message: "weddingId, title, and description are required" });
    }

    const note = new Note({
      weddingId,
      title: title.trim(),
      description: description.trim(),
    });

    await note.save();
    res.status(201).json({ success: true, message: "Note created successfully", note });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ success: false, message: "Error creating note" });
  }
};

export const getNotesByWeddingId = async (req, res) => {
  try {
    const { weddingId } = req.params;

    if (!weddingId) {
      return res.status(400).json({ success: false, message: "weddingId is required" });
    }

    const notes = await Note.find({ weddingId })
      .sort({ updatedAt: -1 })
      .lean();

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ success: false, message: "Error fetching notes" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "title and description are required" });
    }

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.title = title.trim();
    note.description = description.trim();
    await note.save();

    res.status(200).json({ success: true, message: "Note updated", note });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ success: false, message: "Error updating note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ success: false, message: "Error deleting note" });
  }
};
