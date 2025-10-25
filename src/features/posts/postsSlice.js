import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const BASE_URL = 'https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev';

//Async thunk for fetching user's posts
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        const response = await fetch (`${BASE_URL}/posts/user/${userId}`);
        return response.json(); // this is the action in the addCase
        //return [{id: 1, content: "Hello"}]
    }
);

export const savePost = createAsyncThunk(
    "posts/savePost",
    async (postContent) => {
    const token = localStorage.getItem("authToken");
    const decode = jwtDecode(token);
    const userId = decode.id;

    const data = {
        title: "Post Title",
        content: postContent,
        user_id: userId,
    };

    const response = await axios.post(`${BASE_URL}/posts`, data);
    return response.data;
  }
);

//Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: {posts: [], loading: true},
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchPostsByUser.fulfilled, (state,action) => {
            //action payload = [{id: 1, content: "Hello"}]
            // we got it from fetchPostsByUSer output
            state.posts = action.payload;
            //state.posts = [] ; it is the current posts you are showing
            
            //since action payload is returned
            // state.posts = [{id: 1, content: "Hello"}]

            //before: state.loading = true
            //we want the loading animation to stop
            state.loading = false; // to stop the loding animation
        }),
        builder.addCase(savePost.fulfilled, (state, action) => {
            state.posts = [action.payload, ...state.posts];
            // action.payload comes from output of savePost async thunk
            // action.payload {id:8, content: "when is lunch"}

            //state.posts refers to current posts in the postsSlice state
            // state.posts = [{id:7, content: "when is dinner"}, {id:6, content: "when is breakfast"}]

            //state.posts = [action.payload, ...state.posts] is:
            // [{id:8, content: "when is lunch"}, {id:7, content: "when is dinner"}, {id:6, content: "when is breakfast"}]
        });
    },
});

export default postsSlice.reducer;

