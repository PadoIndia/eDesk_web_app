import { Routes, Route, Navigate } from "react-router-dom";
import VideoPage from "./pages/video-details";
import Home from "./pages/home";
import Login from "./pages/login";
import EventsPage from "./pages/events";
import Layout from "./components/layout";
import VideoSearchPage from "./pages/search";
import SocialMediaManagement from "./pages/social-media";
import Logs from "./pages/logs";
import { useAppDispatch, useAppSelector } from "./store/store";
import { useEffect } from "react";
import { checkAuth } from "./features/auth.slice";

function App() {
  const loggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const isVerifying = useAppSelector((s) => s.auth.isVerifying);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  if (isVerifying) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={loggedIn ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          loggedIn ? (
            <Layout>
              <></>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/social-media"
        element={
          loggedIn ? (
            <SocialMediaManagement />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/events/:eventId"
        element={loggedIn ? <Home /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/logs"
        element={loggedIn ? <Logs /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/search"
        element={
          loggedIn ? <VideoSearchPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/videos/:id"
        element={loggedIn ? <VideoPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/events"
        element={loggedIn ? <EventsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="*"
        element={<Navigate to={loggedIn ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
