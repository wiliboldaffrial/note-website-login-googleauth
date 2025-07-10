import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosInstance from '../../../utils/axiosInstance';

export const fetchUser = createAsyncThunk('user/fetchUser', async (_, {rejectWithValue}) => {
    try {
        const response = await axiosInstance.get('/get-user');
        return response.data.user;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return rejectWithValue(error.message);
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchUser.fulfilled, (state, action) => {
            state.userInfo = action.payload;
        });
    },
});

export default userSlice.reducer;