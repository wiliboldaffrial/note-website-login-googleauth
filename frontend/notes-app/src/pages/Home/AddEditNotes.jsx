import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

import { useDispatch } from "react-redux";
import { fetchNotes, addNote, editNote } from "../../redux/features/notes/notesSlice";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  showToastMessage,
}) => {

  const dispatch = useDispatch();

  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState(null);

  /*
  const addNote = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        dispatch(fetchNotes());
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  
  
  const editNote = async () => {
    const noteId = noteData._id

    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", 'update');
        dispatch(fetchNotes());
        showToastMessage("Note Updated Successfully", "update");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };
  */
 /*
  const handleAddNote = () => {
    if (!title) {
      setError("Please enter the title");
      return;
    }

    if (!content) {
      setError("Please enter the content");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };
  */

  const handleAddOrEdit = async () => {
    if (!title) return setError("Please enter the title");
    if (!content) return setError("Please enter the content");

    setError("");

    try {
      if (type === 'edit') {
        await dispatch(
          editNote({ id: noteData._id, title, content, tags })
        ).unwrap();
        showToastMessage("Note Updated Successfully", 'update');
      } else {
        await dispatch(
          addNote({ title, content, tags })
        ).unwrap();
        showToastMessage("Note Added Successfully");
      }

      //dispatch(fetchNotes());
      onClose();

    } catch (error) {
      setError(error?.message || String(error));;
    }

  }
    

  return (
    <div className="relative">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">TITLE</label>
        <input
          type="text"
          className="text-2xl text-slate-950 outline-none"
          placeholder="Go To Gym At 5"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">CONTENT</label>
        <textarea
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
      </div>

      <div className="mt-3">
        <label className="input-label">TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

      <button
        className="btn-primary font-medium mt-5 p-3"
        onClick={handleAddOrEdit}
      >
       {type === 'add' ?  "ADD" : "Update"}
      </button>
      <div className="mt-4 sticky bottom-0 bg-white pt-3 pb-2">
        <button
          className="btn-primary font-medium w-full py-3"
          onClick={handleAddNote}
        >
          {type === "add" ? "ADD" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
