import { Routes, Route, Navigate } from "react-router-dom";
import VideoPage from "./pages/video-details";
import Home from "./pages/home";
import Login from "./pages/login";
import EventsPage from "./pages/events";
import Layout from "./components/layout";
import VideoSearchPage from "./pages/search";
import SocialMediaManagement from "./pages/social-media";
import Logs from "./pages/logs";

function App() {
  const loggedIn = !!localStorage.getItem("@user");

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
