import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {collection, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import {db} from "../../firebase";

//Async thunk for fetching user's posts
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId) => {
        try {
            const postsRef = collection(db, `users/${userId}/posts`);

            const querySnapshot = await getDocs(postsRef);
            const docs = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return docs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const savePost = createAsyncThunk(
    "posts/savePost",
    async (userId, postContent) => {
        try {
        const postsRef = collection(db, `users/${userId}/posts`);
        console.log(`users/${userId}/posts`);
        //since no id is given, Firestore auto generate a unique ID for this new document
        const newPostRef = doc(postsRef);
        console.log(postContent);
        await setDoc(newPostRef, { content: postContent, likes: [] });
        const newPost = await getDoc(newPostRef);

        const post = {
            id: newPost.id,
            ...newPost.data(),
        };

        return post;
    } catch (error) {
        console.error(error);
        throw error;
    }   
  }
);

//Slice
const postsSlice = createSlice({
    name: "posts",
    initialState: {posts: [], loading: true},
    extraReducers: (builder) => {
        builder
        .addCase(fetchPostsByUser.fulfilled, (state,action) => {
            state.posts = action.payload;
            state.loading = false; 
        })
        .addCase(savePost.fulfilled, (state, action) => {
            state.posts = [action.payload, ...state.posts];
        });
    },
});

export default postsSlice.reducer;

