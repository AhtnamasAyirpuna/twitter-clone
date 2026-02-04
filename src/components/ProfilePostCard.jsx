//import useState and axios
import { useState, useContext } from 'react';
import { Button, Col, Image, Row, Modal } from 'react-bootstrap';
import {useDispatch} from 'react-redux';
import {deletePost, likePost, removeLikeFromPost} from '../features/posts/postsSlice';
import { AuthContext } from './AuthProvider';
import UpdatePostModal from './UpdatePostModal';

export default function ProfilePostCard({post}) {
  const {content, id: postId, imageUrl} = post;
  const likes = post.likes || [];
  const dispatch = useDispatch();
  const {currentUser} = useContext(AuthContext);
  const userId = currentUser.uid;

  //user has liked the post if their id is in the likes array
  const isLiked = likes.includes(userId);

  const pic =
    'https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg';

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleShowUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

    const handleLike = () => (isLiked? removeFromLikes() : addToLikes());

    //add userId to likes array
    const addToLikes = () => {
      dispatch(likePost({userId, postId}));
    };

    //remove userID from likes array and update the backend
    const removeFromLikes = () => {
      dispatch(removeLikeFromPost({userId, postId}));
    };

    const handleDelete = () => {
      dispatch(deletePost({userId, postId}));
      setShowDeleteModal(false);
    }

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
        <Image src={imageUrl} key={imageUrl} style={{width: 150}}/>
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
          <Button variant="light">
            <i className="bi bi-pencil-square" onClick={handleShowUpdateModal}></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-trash" onClick={()=>setShowDeleteModal(true)}></i> 
          </Button>
          <UpdatePostModal 
            show = {showUpdateModal}
            handleClose={handleCloseUpdateModal}
            postId={postId}
            originalPostContent={content}
            />
          <Modal 
            show = {showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            > 
              <Modal.Body>
              Are you sure you want to delete this tweet?
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={()=>setShowDeleteModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>Confirm</Button>
              </Modal.Footer>
          </Modal>
        </div>
      </Col>
    </Row>
  );
}
