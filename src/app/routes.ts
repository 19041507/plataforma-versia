import { createBrowserRouter } from "react-router";
import { Index } from "./pages/Index";
import { LoginDesktop } from "./pages/LoginDesktop";
import { LoginMobile } from "./pages/LoginMobile";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Course } from "./pages/Course";
import { Lesson } from "./pages/Lesson";
import { Certificate } from "./pages/Certificate";
import { Subscription } from "./pages/Subscription";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Index,
  },
  {
    path: "/login-desktop",
    Component: LoginDesktop,
  },
  {
    path: "/login-mobile",
    Component: LoginMobile,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/courses",
    Component: Courses,
  },
  {
    path: "/course/:id",
    Component: Course,
  },
  {
    path: "/lesson/:id",
    Component: Lesson,
  },
  {
    path: "/certificate",
    Component: Certificate,
  },
  {
    path: "/subscription",
    Component: Subscription,
  },
]);