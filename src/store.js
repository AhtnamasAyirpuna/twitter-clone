import {configureStore} from "@reduxjs/toolkit";
import postsReducer from "./features/posts/postsSlice";
import userReducer from "./features/users/userSlice";
import feedReducer from "./features/feed/feedSlice"

export default configureStore ({
    reducer: {
        posts: postsReducer,
        user: userReducer,
        feed: feedReducer,
    },
});