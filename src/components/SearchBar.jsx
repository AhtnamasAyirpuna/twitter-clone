import {useState} from "react";
import {Form, Spinner, ListGroup} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import { searchUsers, fetchUserProfile } from "../features/users/userSlice";
import { fetchPostsByUser } from "../features/posts/postsSlice";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [term, setTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {results, loading} = useSelector((state) => state.user);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!term.trim()) return;
        dispatch(searchUsers(term));
        setShowDropdown(true);
    };

    const handleItemClick = (item) => {
        if (term.startsWith("#")) {
          // It’s a hashtag search result → posts
          dispatch(fetchPostsByUser(item.id)); 
        } else {
          // It’s a user → navigate to their profile
          dispatch(fetchUserProfile(item.id));
          navigate(`/profile/${item.id}`);
        }
        setShowDropdown(false);
        setTerm("");
      };

      return (
        <div style={{ position: "relative" }}>
          <Form onSubmit={handleSubmit} className="p-2">
            <Form.Group controlId="searchTerm">
              <Form.Control
                placeholder="Search users or #hashtags"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </Form.Group>
          </Form>
    
          {loading && <Spinner animation="border" className="ms-3 mt-2" />}
    
          {showDropdown && results.length > 0 && (
            <ListGroup
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 10,
                background: "white",
                border: "1px solid lightgray",
              }}
            >
              {results.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  action
                  onClick={() => handleItemClick(item)}
                >
                  {term.startsWith("#") ? item.content : item.username}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      );
    }