import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev';

export const fetchFeed = createAsyncThunk(
    "feed/fetchFeed",
    async (_, { rejectWithValue }) => {
      const token = localStorage.getItem("authToken");
  
      if (!token) return rejectWithValue("No token found in localStorage");
  
      const response = await fetch(`${BASE_URL}/feed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return rejectWithValue(errorData.error || "Failed to fetch feed");
      }
  
      return response.json();
    }
  );
  

export const followUser = createAsyncThunk(
    "feed/followUser",
    async (userId) => {
            const token = localStorage.getItem('authToken')
            const response = await axios.post(`${BASE_URL}/follow/${userId}`, {} /*no request body*/, {
            headers: {Authorization: `Bearer ${token}`},
        });
            return response.data; 
    }
);

export const unfollowUser = createAsyncThunk(
    "feed/unfollowUser",
    async (userId) => {
            const token = localStorage.getItem('authToken')
            const response = await axios.delete(`${BASE_URL}/follow/${userId}`, {
            headers: {Authorization: `Bearer ${token}`},
        });
            return response.data; 
    }
);

//Slice
const feedSlice = createSlice({
    name: "feed",
    initialState: {feed: [], loading: false, error: "" },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchFeed.fulfilled, (state,action) => {
            state.feed = action.payload;
            state.loading = false; // to stop the loding animation
        })
        .addCase(fetchFeed.rejected, (state,action) => {
            state.error = action.error.message;
            state.loading = false; // to stop the loding animation
        })
        .addCase(fetchFeed.pending, (state) => {
            state.loading = true;
            state.error = "";
        })
        .addCase(unfollowUser.fulfilled, (state) => {
            //dont need action as there isnt one when unfollowing
            state.loading = false; // to stop the loding animation
        })
        .addCase(unfollowUser.rejected, (state,action) => {
            state.error = action.error.message;
            state.loading = false; // to stop the loding animation
        })
        .addCase(unfollowUser.pending, (state) => {
            state.loading = true;
            state.error = "";
        })
        .addCase(followUser.fulfilled, (state) => {
            // dont need action as there isn't one
            state.loading = false; //When someone follows or unfollows a user, the backend doesn’t actually send an updated feed array — it probably returns a single message or follow record.
        })
        .addCase(followUser.rejected, (state,action) => {
            state.error = action.error.message;
            state.loading = false; // to stop the loding animation
        })
        .addCase(followUser.pending, (state) => {
            state.loading = true;
            state.error = "";
        });
    },
});

export default feedSlice.reducer;
