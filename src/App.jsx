import AuthPage from './pages/AuthPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import {Provider} from "react-redux";
import store from "./store";
import UserProfile from './components/UserProfile';
import Feed from './components/Feed';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="*" element={<AuthPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
