import { Col, Row, Image, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthProvider';

export default function AuthPage() {
  const loginImage = 'https://sig1.co/img-twitter-1';
  const url =
    'https://ebab9dbd-f5f1-417e-836d-58117ec988f6-00-236pt25bvhvxb.sisko.replit.dev'; //from auth back end API

  //Possible values: null (no modal shows), "Login", "Signup"
  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => setModalShow('SignUp');
  const handleShowLogin = () => setModalShow('Login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate ("/profile");
      setError("");
    }
  }, [currentUser, navigate]);

  //Setup reCaptcha and send code..study!
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  const handleSendCode = async(e) => {
    e.preventDefault();
    setupRecaptcha();
    try{
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setError("");
      alert("VErification code sent!");
    } catch (error) {
      setError("Failed to send code. Please check the phone number.");
      console.error(error);
    }
  };

  //Verify code and login
  const handleVerifyCode = async(e) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError("Please send the code first.");
      return;
    }
    try {
      const result = await confirmationResult.confirm(verificationCode);
      if (result.user) {
        navigate("/profile")
      }
    } catch (error) {
      setError("Invalid verification code");
      console.error(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        username,
        password
      );
      console.log(res.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, username, password);
      setError("")
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else {
        setError('Something went wrong. Please try again')
      }     
    }
  };

  const provider = new GoogleAuthProvider();
  const handleGoogleLogin = async(e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

 

  const handleClose = () => setModalShow(null);

  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid />
      </Col>
      <Col sm={6} className="p-4">
        <i
          className="bi bi-twitter"
          style={{ fontSize: 50, color: 'dodgerblue' }}
        ></i>

        <p className="mt-5" style={{ fontSize: 64 }}>
          Happening Now
        </p>
        <h2 className="my-5" style={{ fontSize: 31 }}>
          Join Twitter Today
        </h2>

        <Col sm={5} className="d-grid gap-2">
          <Button className="rounded-pill" variant="outline-dark" onClick={handleGoogleLogin}>
            <i className="bi bi-google"></i> Sign up with Google
          </Button>
          <Button className="rounded-pill" variant="outline-dark">
            <i className="bi bi-apple"></i> Sign up with Apple
          </Button>
          <Button className="rounded-pill" variant="outline-dark" onClick={() => setShowPhoneForm(!showPhoneForm)}>
            <i className="bi bi-telephone-fill"></i> Sign up with Phone Number
          </Button>

        {showPhoneForm && (
          <>
            <Form className='d-flex mt-2' onSubmit={handleSendCode}>
          <Form.Control 
            type="tel"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e)=>setPhoneNumber(e.target.value)}
            />
            <Button
              type="submit"
              className='ms-2'
              variant="outline-success">
                Send Code
            </Button>
        </Form>
        {/*Verification code field*/}
        {confirmationResult && (
          <Form className='d-flex mt-2' onSubmit={hendleVerifyCode}>
            <Form.Control 
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              type="submit"
              className='ms-2'
              variant='outline-primary'>
                Verify
            </Button>
          </Form>
        )}

          <div id="recaptcha-container"></div>
          </>
        )}
        

          <p style={{ textAlign: 'center' }}>or</p>
          <Button className="rounded-pill" onClick={handleShowSignUp}>
            Create an account
          </Button>
          <p style={{ fontSize: '12px' }}>
            By signing up, you agree to the Terms of Service and Privacy Policy
            including Cookie Use
          </p>

          <p className="mt-5" style={{ fontWeight: 'bold' }}>
            Already have an account?
          </p>

          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign In
          </Button>
        </Col>
        <Modal
          show={modalShow !== null}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: 'bold' }}>
              {modalShow === 'SignUp'
                ? 'Create your account'
                : 'Log in to your account'}
            </h2>
            <Form
              className="d-grid gap-2 px-5"
              onSubmit={modalShow === 'SignUp' ? handleSignUp : handleLogin}
            >
              <Form.Group className="mb-3" controlId="forBasicEmail">
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="forBasicPassword">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>
              <p style={{ fontSize: '12px' }}>
                By signing up, you agree to the Terms of Service and Privacy
                Policy, including Cookie Use. Sigma Tweets may use your contact
                information, including your email address and phone number for
                purposes outlined in our Privacy Policy, like keeping your
                account secure and personalising our services, including ads.
                Learn more. Others will be able to find your email or phone
                number, when provide, unless you choose otherwise here.
              </p>

              {error && <p className='error-text'>{error}</p>}
              <Button className="rounded-pill" type="submit">
                {modalShow === 'SignUp' ? 'Sign up' : 'Log in'}
              </Button>

            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
