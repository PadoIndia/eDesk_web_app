import { Routes, Route, Navigate } from "react-router-dom";
import VideoPage from "./pages/video-details";
import Home from "./pages/home";
import Login from "./pages/login";
import EventsPage from "./pages/events";
import VideoSearchPage from "./pages/search";
import SocialMediaManagement from "./pages/social-media";
import { useAppDispatch, useAppSelector } from "./store/store";
import { useEffect } from "react";
import { checkAuth } from "./features/auth.slice";
import Layout from "./components/layout";
import Uploads from "./pages/uploads";
import UsersList from "./pages/users/components/user-list";
import HrmApp from "./hrm-app";

function App() {
  const loggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const isVerifying = useAppSelector((s) => s.auth.isVerifying);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  if (isVerifying) {
    return (
      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/hrm/*"
        element={loggedIn ? <HrmApp /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/"
        element={loggedIn ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Home />} />
        <Route path="events/:eventId" element={<Home />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="videos/:id" element={<VideoPage />} />
        <Route path="search" element={<VideoSearchPage />} />
        <Route path="social-media" element={<SocialMediaManagement />} />
        <Route path="uploads" element={<Uploads />} />
        <Route path="users/list" element={<UsersList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
