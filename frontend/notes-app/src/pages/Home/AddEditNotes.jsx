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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    };
  }

  const handleAddOrEdit = async () => {
    if (!title) return setError("Please enter the title");
    if (!content) return setError("Please enter the content");

    setError("");

    try {
      if (type === 'edit') {
        await dispatch(
          editNote({ id: noteData._id, title, content, tags, image })
        )
        .unwrap()
        .then(() => {
          showToastMessage("Note Updated Successfully", 'update');
          dispatch(fetchNotes({ page: 1, limit: 16 }));
          onClose();
        })
        .catch((error) => {setError(error?.message || String(error));
        });
      } else {
        await dispatch(addNote({ title, content, tags, image }))
        .unwrap()
        .then(() => {
          showToastMessage("Note Added Successfully");
          dispatch(fetchNotes({ page: 1, limit: 16 }));
          onClose();
        })
        .catch((error) => {
          setError(error);
        });
      }
    } catch (error) {
      setError(error?.message || String(error));;
    }

  }
    
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
            placeholder="Title"
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
            rows={5}
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
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer border border-blue-200 hover:bg-blue-100 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <span className="text-sm font-medium">{image ? "Change Image" : "Upload Image"}</span>
            </label>
            {preview && (
              <img
                src={preview?.startsWith("data:") || preview?.startsWith("blob:") 
                  ? preview : `data:image/*;base64,${preview}`}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border border-gray-200 shadow"
              />
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-xs pt-4">{error}</p>}
      </div>

      <div className="mt-4 sticky bottom-0 bg-white pt-3 pb-2">
        <button
          className="btn-primary font-medium w-full py-3"
          onClick={handleAddOrEdit}
        >
          {type === "add" ? "ADD" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;
