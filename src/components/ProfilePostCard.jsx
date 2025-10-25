//import useState and axios
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

export default function ProfilePostCard({ content, postId }) {
//  likes → holds the number of likes.
  const [likes, setLikes] = useState(0);

  //Decoding to get the userID
  const token = localStorage.getItem("authToken");
  const decode = jwtDecode(token)
  const userId = decode.id;

  const pic =
    'https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg';
  const BASE_URL = "https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev"

  
    useEffect(() => {
      fetch(`${BASE_URL}/likes/post/${postId}`)
      .then((response) => response.json())
      .then((data) => setLikes(data))
      .catch((error) => console.error("Error:", error));
  }, [postId]);

    const isLiked = likes.some((like) => likes.user_id === userId);


    //Must change somemore, follow the slide
    // On component mount, fetch all comments for the current post (GET /comments/:id).
    useEffect(() => {
      axios.get(
        `https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev/comments/post/${postId}`
      )
        .then((response) => {
          setComments(response.data);
      })
        .catch((error) => console.error('Error fetching comments:', error));
    }, [postId]);

    const handleAddComment = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to add a comment");
        return;
      }
    
      // Prepare comment data
      const data = {
        content: newComment,
        post_id: postId, // ✅ postId, not userId
      };
    
      // Optimistic update
      const tempComment = { commentary: newComment };
      setComments((prev) => [...prev, tempComment]);
      setNewComment("");
    
      try {
        await axios.post(
          `https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev/comments`,
          data,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error adding comment:", error);
        // rollback if failed
        setComments((prev) =>
          prev.filter((c) => c !== tempComment)
        );
      }
    };

    const handleToggleLike = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to like a post");
        return;
      }
    
      // optimistic UI update
      setLiked(prev => !prev);
      setLikes(prev => (liked ? Math.max(prev - 1, 0) : prev + 1));
    
      try {
        const res = await axios.post(
          `https://175832dd-90fa-44eb-84b2-8a283f365570-00-14fzj9uhfh1kr.pike.replit.dev/likes/${postId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Use real server response to ensure state is correct
        if (res.data && typeof res.data.liked !== 'undefined') {
          setLiked(res.data.liked);
          setLikes(prev => {
            // adjust likes to server truth (simple approach)
            return res.data.liked ? prev + 0 : Math.max(prev - 0, 0);
          });
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        // rollback
        setLiked(prev => !prev);
        setLikes(prev => (liked ? prev + 1 : Math.max(prev - 1, 0)));
      }
    };

    // Create a handleUnlike function that:
    const handleUnlike = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to unlike a post');
        return;
      }
    
      // optimistic
      setLiked(false);
      setLikes(prev => Math.max(prev - 1, 0));
    
      try {
        await axios.delete(
          `https://175832dd-90fa-44eb-84b2-8a283f365570-00-14fzj9uhfh1kr.pike.replit.dev/likes/${postId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error unliking post:', error);
        // rollback
        setLiked(true);
        setLikes(prev => prev + 1);
      }
    };    

  return (
    <Row
      className="p-3"
      style={{
        borderTop: '1px solid #D3D3D3',
        borderBottom: '1px solid #D3D3D3',
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>

      <Col>
        <strong>Samantha</strong>
        <span> @samantha.anupriya · Aug 9</span>
        <p>{content}</p>
        <div className="mt-3">
            <h6>Comments:</h6>
            {comments.map((comment, index) => (
              <p key={index}>{comment.commentary}</p>
            ))}

          <div className="d-flex mt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="form-control me-2"
              />
              <Button variant="primary" onClick={handleAddComment}>
                Add
              </Button>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant="light" onClick={handleToggleLike}>
            <i className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>{' '}
            {likes}
          </Button>
          <Button variant="light">
            <i className="bi bi-graph-up"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-upload"></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
