import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import Toast from "../../components/ToastMessage/Toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AddNotesImg from "../../assets/images/add-notes.svg";
import NoDataImg from "../../assets/images/no-data.svg";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import Masonry from "react-masonry-css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-6 space-x-2 items-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50"
      >
        &larr;
      </button>
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-4 py-2 border rounded ${
            currentPage === num
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600 hover:bg-blue-100"
          }`}
        >
          {num}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50"
      >
        &rarr;
      </button>
    </div>
  );
};

import {useDispatch, useSelector} from 'react-redux';
import { fetchNotes, deleteNote, togglePin, searchNotes, clearSearch } from "../../redux/features/notes/notesSlice";
import { fetchUser } from "../../redux/features/notes/userSlice";

const Home = () => {
  const dispatch = useDispatch();
  const allNotes = useSelector((state) => state.notes.allNotes) || [];
  const isSearch = useSelector((state) => state.notes.isSearch);
  const userInfo = useSelector((state) => state.notes.userInfo);

  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 9;

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = allNotes.slice(indexOfFirstNote, indexOfLastNote);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const totalPages = useSelector((state) => state.notes.totalPages);

  const navigate = useNavigate();

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message: message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //updated deleteNoteHandler
  const handleDelete = async (note) => {
    dispatch(deleteNote(note._id));
    showToastMessage("Note deleted successfully", "delete");
  };

  const handlePinToggle = async (note) => {
    dispatch(togglePin(note));
    dispatch(fetchNotes({page, limit}));
    showToastMessage("Note Updated Successfully", "update");
  };

  const handleSearch = (query) => {
    dispatch(searchNotes(query));
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    dispatch(fetchNotes());
  }

  useEffect(() => {
    dispatch(fetchNotes({page, limit})); 
    dispatch(fetchUser()); 
    dispatch(clearSearch());
    
  }, [dispatch, page, limit]);

  useEffect(() => {
    setCurrentPage(1);
  }, [allNotes]);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={handleSearch}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto">
        {isSearch ? (
          <>
            <h3 className="text-lg font-medium mt-5">Search Results</h3>
            {currentNotes.length > 0 ? (
              <Masonry
  breakpointCols={{ default: 3, 768: 2, 500: 1 }}
  className="flex gap-4"
  columnClassName="my-masonry-column"
>
  {currentNotes.map((item) => (
    <NoteCard
      key={item._id}
      title={item.title}
      content={item.content}
      date={item.createdOn}
      tags={item.tags}
      isPinned={item.isPinned}
      image={item.image}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
      onPinNote={() => handlePinToggle(item)}
    />
  ))}
</Masonry>

            ) : (
              <EmptyCard
                imgSrc={NoDataImg}
                message="Oops! No notes found matching your search."
              />
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium mt-5">All Notes</h3>
            {currentNotes.length > 0 ? (
              <Masonry
  breakpointCols={{ default: 3, 768: 2, 500: 1 }}
  className="flex gap-4"
  columnClassName="my-masonry-column"
>
  {currentNotes.map((item) => (
    <NoteCard
      key={item._id}
      title={item.title}
      content={item.content}
      date={item.createdOn}
      tags={item.tags}
      isPinned={item.isPinned}
      image={item.image}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item)}
      onPinNote={() => handlePinToggle(item)}
    />
  ))}
</Masonry>

            ) : (
              <EmptyCard
                imgSrc={AddNotesImg}
                message="Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas, and reminders. Let's get started!"
              />
            )}
          </>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
        
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel="Example Modal"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          showToastMessage={showToastMessage}
          //getAllNotes={dispatch(fetchNotes())}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;