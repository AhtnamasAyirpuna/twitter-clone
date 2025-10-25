//import useState and axios
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Image, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

export default function ProfilePostCard({ content, postId }) {
//  likes → holds the number of likes.
  const [likes, setLikes] = useState([]);

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

    const isLiked = likes.some((like) => like.user_id === userId);

    const handleLike = () => (isLiked? removeFromLikes() : addToLikes());

    const addToLikes = () => {
      axios.post(`${BASE_URL}/likes`, {
        user_id: userId,
        post_id: postId,
      })
      .then((response) => {
        setLikes([...likes, {...response.data, likes_id: response.data.id}])
      })
      .catch((error) => console.error("Error:", error))
    }

    const removeFromLikes = () => {
      const like = likes.find((like) => like.user_id === userId);
      if (like) {
        axios
        .put(`${BASE_URL}/likes/${userId}/${postId}`) // Include userId and postId in the url
        .then(() => {
          //update the state to reflect the removal of the like
          setLikes(likes.filter((likeItem) => likeItem.user_id !== userId));
        })
        .catch((error) => console.error("Error:", error));
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
          <Button variant="light" onClick={handleLike}>
            {isLiked ? (
              <i className='bi bi-heart-fill text-danger'></i>
            ) : (
              <i className='bi bi-heart'></i>
            )}
            {likes.length}
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
