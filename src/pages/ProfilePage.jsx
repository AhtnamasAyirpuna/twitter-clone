import { Container, Row } from 'react-bootstrap';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from 'use-local-storage';
import ProfileSideBar from '../components/ProfileSideBar';
import ProfileMidBody from '../components/ProfileMidBody';

export default function ProfilePage() {
  const [authToken, setAuthToken] = useLocalStorage('authToken', '');
  const navigate = useNavigate();

  //Check for auth token immediately upon component mount and whenever authToken changes
  useEffect(() => {
    if (!authToken || authToken.trim() === '') {
      navigate('/login');
    }
  }, [authToken, navigate]);

  const handleLogout = () => {
    setAuthToken(''); //Clear token from local storage
  };

  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  );
}
