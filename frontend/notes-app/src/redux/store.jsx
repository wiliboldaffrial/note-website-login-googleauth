import {configureStore} from '@reduxjs/toolkit';
import notesReducer from './features/notes/notesSlice';
import userReducer from './features/notes/userSlice';

export const store = configureStore({
    reducer: {
        notes: notesReducer,
        user: userReducer,
    },
});

export default store;
