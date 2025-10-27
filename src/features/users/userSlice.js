import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';


const BASE_URL = 'https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev';

export const searchUsers = createAsyncThunk(
    "users/searchUsers",
    async (term) => {
        const response = await fetch (`${BASE_URL}/search?q=${encodeURIComponent(term)}`);
        return response.json(); 
    }
);

export const fetchUserProfile = createAsyncThunk(
    "users/fetchUserProfile",
    async (userId) => {
        const response = await fetch (`${BASE_URL}/users/${userId}`);
        return response.json();
    }
);

//Slice
const userSlice = createSlice({
    name: "user",
    initialState: {results: [], profile: {}, loading: false, error: ""},
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(searchUsers.fulfilled, (state,action) => {
            state.results = action.payload;
            state.loading = false; // to stop the loding animation
        })
        .addCase(searchUsers.rejected, (state,action) => {
            state.error = action.error.message;
            state.loading = false; // to stop the loding animation
        })
        .addCase(searchUsers.pending, (state) => {
            state.loading = true;
            state.error = "";
        })
        .addCase(fetchUserProfile.fulfilled, (state, action) => {
            state.profile = action.payload;
            state.loading = false;
        })
        .addCase(fetchUserProfile.rejected, (state,action) => {
            state.error = action.error.message;
            state.loading = false; // to stop the loding animation
        })
        .addCase(fetchUserProfile.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
    },
});

export default userSlice.reducer;

