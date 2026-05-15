import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import RootLayout from "./layouts/RootLayout";
import DashboardLayout from "./layouts/DashBoard";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Repository from "./pages/Repository";
import PullRequests from "./pages/PullRequests";
import Issues from "./pages/Issues";
import Features from "./pages/Features";
import Profile from "./pages/Profile";
import Repositories from "./pages/Repositories";

import ProtectedRoute from "./routes/ProtectedRoute";

import ChangePassword from "./components/ChangePassword";
import AddRepo from "./components/AddRepo";
import UpdateProf from "./components/UpdateProf";
import EditRepo from "./components/EditRepo";
import CreatePR from "./components/CreatePR";
import RepoPR from "./components/RepoPR";
import PRDetails from "./components/PRDetails";
import UpdatePR from "./components/UpdatePR";
import CommitHistory from "./components/CommitHistory";
import CommitDetails from "./components/CommitDetails";
import MyPullRequests from "./components/MyPullRequests";
import IncomingPullRequests from "./components/IncomingPullRequests";
import RepoIssues from "./components/RepoIssues";
import CreateIssue from "./components/CreateIssue";
import IssueDetails from "./components/IssueDetails";
import CommentSection from "./components/CommentSection";
import AddFile from "./components/AddFile";
import FileView from "./components/FileView";
import EditFile from "./components/EditFile";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/features",
        element: <Features />,
      },
    ],
  },

  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },

      {
        path: "/repositories",
        element: <Repositories />,
      },

      {
        path: "/repo",
        element: <Repository />,
      },

      {
        path: "/repo/:id/pulls",
        element: <PullRequests />,
      },

      {
        path: "/repo/:id/issues",
        element: <Issues />,
      },

      {
        path: "/profile/:username",
        element: <Profile />,
      },

      {
        path: "/change-pass",
        element: <ChangePassword />,
      },

      {
        path: "/add-repo",
        element: <AddRepo />,
      },

      {
        path: "/update-profile",
        element: <UpdateProf />,
      },

      {
        path: "/edit-repo",
        element: <EditRepo />,
      },

      {
        path: "/create-pr",
        element: <CreatePR />,
      },

      {
        path: "/pull-req",
        element: <RepoPR />,
      },

      {
        path: "/pull-request/:id",
        element: <PRDetails />,
      },

      {
        path: "/update-pr",
        element: <UpdatePR />,
      },

      {
        path: "/repo-commits",
        element: <CommitHistory />,
      },

      {
        path: "/commit/:id",
        element: <CommitDetails />,
      },

      {
        path: "/my-pr",
        element: <MyPullRequests />,
      },

      {
        path: "/incoming-pr",
        element: <IncomingPullRequests />,
      },

      {
        path: "/repo-issues",
        element: <RepoIssues />,
      },

      {
        path: "/create-issue",
        element: <CreateIssue />,
      },

      {
        path: "/issue/:id",
        element: <IssueDetails />,
      },

      {
        path: "/comments",
        element: <CommentSection />,
      },

      {
        path: "/add-file",
        element: <AddFile />,
      },

      {
        path: "/file-view/:id",
        element: <FileView />,
      },

      {
        path: "/edit-file/:id",
        element: <EditFile />,
      },
    ],
  },
]);

function App() {

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;