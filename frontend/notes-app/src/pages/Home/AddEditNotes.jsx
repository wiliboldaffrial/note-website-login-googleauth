import React, { useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
  noteData,
  type,
  onClose,
  showToastMessage,
  getAllNotes,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(noteData?.image || null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addNewNote = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));
      if (image) formData.append("image", image);

      const response = await axiosInstance.post("/add-note", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Added Successfully");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("tags", JSON.stringify(tags));
      if (image) formData.append("image", image);

      const response = await axiosInstance.put("/edit-note/" + noteId, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully", "update");
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(
        error?.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

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

  return (
    <div className="relative h-full max-h-[70vh] flex flex-col">
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50"
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className="flex-1 overflow-y-auto pr-2">
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

        <div className="mt-4">
          <label className="input-label">IMAGE</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={
              preview?.startsWith("data:") || preview?.startsWith("blob:")
                ? preview
                : `data:image/*;base64,${preview}`
    }

              alt="preview"
              className="mt-2 w-full max-h-64 object-contain rounded"
            />
          )}
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      </div>

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