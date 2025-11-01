import {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed, followUser, unfollowUser } from '../features/feed/feedSlice';
import { Spinner, Container} from "react-bootstrap";

export default function Feed() {
    const dispatch = useDispatch();
    const {feed, loading, error} = useSelector((state) => state.feed);

    //on mount, fetch posts
    useEffect(() => {
        dispatch(fetchFeed());
    }, [dispatch]);

   const handleFollowToggle = (userId, isFollowing) => {
    if (isFollowing) {
         dispatch(unfollowUser(userId));
    } else {
        dispatch(followUser(userId));
    } 
    dispatch(fetchFeed());
   };

   if (loading) return <Spinner animation='border' className='m-4' />;
   if (error) return <p>Error: {error}</p>;
   if (!Array.isArray(feed)) return <p>Feed data is invalid or unauthorized.</p>;

   return (
    <Container className='my-4' style={{maxWidth: "600px"}}>
        <h3 className="mb-4">Feed</h3>

        {feed.length === 0 && <p>No posts yet</p>}

        {feed.map((post) => (
          <div key={post.id} className="border p-3 rounded mb-3">
          <h4>@{post.username}</h4>
          <p>{post.content}</p>
          <small>{new Date(post.created_at).toLocaleString()}</small>
          {post.is_following ? (
            <button onClick={() => dispatch(unfollowUser(post.author_id))}>Unfollow</button>
          ) : (
            <button onClick={() => dispatch(followUser(post.author_id))}>Follow</button>
          )}
          </div>
        ))}
    </Container>
   )
};