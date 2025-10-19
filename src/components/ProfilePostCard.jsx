//import useState and axios
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Image, Row } from 'react-bootstrap';

export default function ProfilePostCard({ content, postId }) {
//  Add two state variables:
//  likes → holds the number of likes.
//  liked → tracks if the user has liked the post.
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const pic =
    'https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg';

  //Fetch total likes for the post
    useEffect(() => {
      axios.get(
        `https://175832dd-90fa-44eb-84b2-8a283f365570-00-14fzj9uhfh1kr.pike.replit.dev/likes/post/${postId}`
      )
        .then((response) => {
          setLikes(response.data.length);
      })
        .catch((error) => console.error('Error fetching likes:', error));
    }, [postId]);


    // Create a handleUnlike function that:
  const handleUnlike = async() => {
    try {
      // Includes the JWT token from localStorage in the Authorization header.
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to unlike a post');
        return;
      }

    // Sends a DELETE request to /likes/:postId.  
    await axios
      .delete(
        `https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev/likes/${postId}`,
        {
          headers: {Authorization: `Bearer ${token}`},
        }
      );

      // Immediately decreases likes by 1 and sets liked to false (optimistic update).
      setLiked(false);
      setLikes((prevLikes) => Math.max(prevLikes - 1, 0));

      console.log('Post unliked successfully');

      } catch(error) {
        console.error('Error unliking post:', error);
      }
  };


    //handleLike backend not done yet
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('You must be logged in to like a post');
        return;
      }
  
      // Optimistically update UI
      setLiked(true);
      setLikes((prevLikes) => prevLikes + 1);
  
      // Send POST request
      await axios.post(
        `https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev/likes/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log('Post liked successfully');
    } catch (error) {
      console.error('Error liking post:', error);
      // revert if failed
      setLiked(false);
      setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
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
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant="light" onClick={liked ? handleUnlike : handleLike}>
          <i
            className={`bi ${liked ? 'bi-heart-fill text-danger' : 'bi-heart'}`}
            ></i>{' '}
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
