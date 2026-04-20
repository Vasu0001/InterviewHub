import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Landing, Room, Auth, Dashboard } from "./components/index.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Landing />} />
      <Route path="auth" element={<Auth />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
