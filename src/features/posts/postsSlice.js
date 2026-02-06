import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc} from "firebase/firestore";
import {db, storage} from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const updatePost = createAsyncThunk(
    "posts/updatePost",
    async({userId, postId, newPostContent, newFile}) => {
        try {
            //upload the new file to the storage if it exists and get its url
            let newImageUrl = null;
              
            if (newFile) {
                const imageRef = ref(storage, `posts/${newFile.name}`);
                const response = await uploadBytes(imageRef, newFile);
                newImageUrl = await getDownloadURL(response.ref);
      }

      const postRef = doc(db, `users/${userId}/posts/${postId}`);
      const postSnap = await getDoc(postRef);

      if (!postSnap.exists()) {
        throw new Error("Post does not exist");
      }

      const postData = postSnap.data();

      // Build update object safely
      const updatedData = {
        content: newPostContent || postData.content,
      };

      // Only add imageUrl if new image uploaded
      if (newImageUrl) {
        updatedData.imageUrl = newImageUrl;
      }

      await updateDoc(postRef, updatedData);

      return {
        id: postId,
        content: updatedData.content,
        imageUrl: updatedData.imageUrl ?? postData.imageUrl,
        likes: postData.likes || [],
      };

    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);


//Async thunk for fetching user's posts
export const fetchPostsByUser = createAsyncThunk(
    "posts/fetchByUser",
    async (userId, {dispatch}) => {
        try {
            dispatch({ type: "posts/loading" });
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
    async ({userId, postContent, file}) => {
        //
        try {
        let imageUrl = "";
        console.log(file);
        if (file !== null) {
            const imageRef = ref(storage, `posts/${file.name}`);
            const response = await uploadBytes(imageRef, file);
            imageUrl = await getDownloadURL(response.ref);
        }
        
        const postsRef = collection(db, `users/${userId}/posts`);
        //since no id is given, Firestore auto generate a unique ID for this new document
        const newPostRef = doc(postsRef);
        await setDoc(newPostRef, {content: postContent, likes: [], imageUrl});
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

export const likePost = createAsyncThunk(
    "posts/likePost",
    async({userId, postId}) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);

            const docSnap = await getDoc(postRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();
                const likes = [...postData.likes, userId];

                await updateDoc(postRef, {likes});
            }

            return {userId, postId};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const removeLikeFromPost = createAsyncThunk(
    "posts/removeLikeFromPost",
    async({userId, postId}) => {
        try {
            const postRef = doc(db, `users/${userId}/posts/${postId}`);

            const docSnap = await getDoc(postRef);

            if (docSnap.exists()) {
                const postData = docSnap.data();
                const likes = postData.likes.filter((id) => id !== userId);

                await updateDoc(postRef, {likes});
            }

            return {userId, postId};
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);

export const deletePost = createAsyncThunk(
    "posts/deletePost",
    async ({userId, postId}) => {
        try {
            //reference to the post
            const postRef = doc(db, `users/${userId}/posts/${postId}`);
            //delete the post
            await deleteDoc(postRef);
            //return the id of the deleted post
            return postId;
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
        })
        .addCase(likePost.fulfilled, (state, action) => {
            const {userId, postId} = action.payload;

            const postIndex = state.posts.findIndex((post) => post.id === postId);

            if (postIndex !== -1) {
                state.posts[postIndex].likes.push(userId);
            }
        })
        .addCase(removeLikeFromPost.fulfilled, (state, action) => {
            const {userId, postId} = action.payload;

            const postIndex = state.posts.findIndex((post) => post.id === postId);

            if (postIndex !== -1) {
                state.posts[postIndex].likes = state.posts[postIndex].likes.filter(
                    (id) => id !== userId
                );
            }
        })
        .addCase("posts/loading", (state) => {
            state.loading = true;
          })
        .addCase(updatePost.fulfilled, (state, action) => {
            const updatedPost = action.payload;
            //find and update the post in the state
            const postIndex = state.posts.findIndex (
                (post) => post.id === updatedPost.id
            );
            if (postIndex !== -1) {
                state.posts[postIndex] = {
                    ...state.posts[postIndex],
                    ...updatedPost,
                };
            }
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            const deletedPostId = action.payload;
            //filter out the deleted post from state
            state.posts = state.posts.filter((post) => post.id !== deletedPostId);
        })
    },
});

export default postsSlice.reducer;

