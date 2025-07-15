import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';
import axios from 'axios';

// async thunk to get all notes
export const fetchNotes = createAsyncThunk('/notes/fetchNotes', async ({ page=1, limit=16 }) => {
    const response = await axiosInstance.get('/get-all-notes', { params: { page, limit }});
    return response.data; // Return the whole response object
});

export const deleteNote = createAsyncThunk('/notes/deleteNote', async (noteId, thunkAPI) => {
    try {
        await axiosInstance.delete(`/delete-note/${noteId}`);
        return noteId;
    } catch (error) {
        return thunkAPI.rejectWithValue("Failed to delete note");
    }
});

export const searchNotes = createAsyncThunk('/notes/searchNotes', async (query) => {
    const response = await axiosInstance.get('/search-notes', {params: {query}});
    return response.data.notes;
});

// add edit notes thunks
export const addNote = createAsyncThunk('/notes/addNote', async ({title, content, tags, image}, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', JSON.stringify(tags));
        if (image) {
            formData.append('image', image);
        }
        const response = await axiosInstance.post('/add-note', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.note;
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Failed to add note"
        );
    }
});

export const editNote = createAsyncThunk('/notes/editNote', async ({id, title, content, tags, image}, thunkAPI) => {
    try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', JSON.stringify(tags));
        if (image) {
            formData.append('image', image);
        }
        const response = await axiosInstance.put(`/edit-note/${id}`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.note;
    } catch (error) {
        return thunkAPI.rejectWithValue(
            error?.response?.data?.message || "Failed to update note"
        );
    }

});

// togglePin thunk
export const togglePin = createAsyncThunk('/notes/togglePin', async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        {
          isPinned: !noteData.isPinned,
        }
      );
      return response.data.note;

      
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
});

const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        allNotes: [],
        status: 'idle',
        error: null,
        totalPages: 1,
    },
    reducers: {
        clearSearch: (state) => {
            state.isSearch = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchNotes.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchNotes.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.allNotes = action.payload.notes;
            state.totalPages = action.payload.totalPages;
            state.isSearch = false;
        })
        .addCase(fetchNotes.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
        .addCase(searchNotes.fulfilled, (state, action) => {
            state.allNotes = action.payload;
            state.isSearch = true;
        })
        .addCase(addNote.fulfilled, (state, action) => {
            state.allNotes.unshift(action.payload);
        })
        .addCase(editNote.fulfilled, (state, action) => {
            const index = state.allNotes.findIndex(note => note._id === action.payload._id);
            if (index !== -1) state.allNotes[index] = action.payload;
        })
        .addCase(deleteNote.fulfilled, (state, action) => {
            state.allNotes = state.allNotes.filter(note => note._id !== action.payload);
        })
        .addCase(togglePin.fulfilled, (state, action) => {
            const updatedNote = action.payload;
            const index = state.allNotes.findIndex(note => note._id === updatedNote._id);
            if (index !== -1) state.allNotes[index] = updatedNote;
        })
    },
})

export const {clearSearch} = notesSlice.actions;
export default notesSlice.reducer;