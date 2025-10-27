import { Button, Col, Image, Nav, Row, Spinner, Form } from 'react-bootstrap';
import ProfilePostCard from './ProfilePostCard';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import { fetchPostsByUser } from '../features/posts/postsSlice';

export default function ProfileMidBody() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const url =
    'https://pbs.twimg.com/profile_banners/83072625/1602845571/1500x500';
  const pic =
    'https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg';
  const BASE_URL = 'https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev';

    const dispatch = useDispatch()
    const posts = useSelector(store => store.posts.posts)
    const loading =  useSelector(store => store.posts.loading)

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // const token = 'jwfkbvkgrbjgbrvr.jndvcjbguirbgvneojnv"
    if (token) {
      //it token exists
      const decodedToken = jwtDecode(token);
      // const decodedToken = {id:6, username: 'me'}
      const userId = decodedToken.id;
      console.log(userId);
      dispatch(fetchPostsByUser(userId));
    }
  }, [dispatch]);

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if (!searchTerm.trim()) return; //if nothing is typed, stop the function
    setSearching(true);
    try {
      const response = await axios.get(`${BASE_URL}/posts/search?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  const postsToDisplay = searchTerm ? searchResults : posts;

  return (
    <Col sm={6} className="bg-light" style={{ border: '1px solid lightgrey' }}>
      <Form onSubmit={handleSubmit} className='p-2'>
            <Form.Group controlId="searchTerm">
              <Form.Control
                placeholder="Search"
                value = {searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
      </Form>

      {searching && (
        <Spinner animation="border" className='ms-3 mt-3' variant='primary'/>
      )}

      <Image src={url} fluid />
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: 'absolute',
          top: '140px',
          border: '4px solid #F8F9FA',
          marginLeft: 15,
        }}
      />

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className="rounded-pill mt-2" variant="outline-secondary">
            Edit Profile
          </Button>
        </Col>
      </Row>

      <p
        className="mt-5"
        style={{ margin: 0, fontWeight: 'bold', fontSize: '15px' }}
      >
        Samantha
      </p>

      <p style={{ marginBottom: '2px' }}>@samantha.anupriya</p>

      <p>
        I help people switch careers to be a software developer at
        sigmaschool.co
      </p>

      <p>Entrepreneur</p>

      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && (
        <Spinner animation="border" className='ms-3 mt-3' variant="primary" />
      )}
      {/*posts = [{id: 4, content: 'sigma school'}] */}
      {postsToDisplay.length > 0 && postsToDisplay.map((post) => (
          //post = {id: 4, content: 'sigma school'}
          <ProfilePostCard
            key={post.id}
            content={post.content}
            postId={post.id}
          />
          //<ProfilePostCard key={4} content={sigma school}
        ))}
    </Col>
  );
}
