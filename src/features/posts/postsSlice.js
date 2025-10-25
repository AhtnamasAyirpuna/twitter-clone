import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

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
        });
    },
});

export default postsSlice.reducer;

