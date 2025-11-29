import { url } from "inspector";
import { Activity, Album, Book, Users } from "lucide-react";
import { title } from "process";

export const SIDEBAR_MENU_LIST = {
  user: [
    {
      title: "Dashboard",
      url: "/users",
      icon: Users,
    },
    {
      title: "Courses",
      url: "/users/courses",
      icon: Book,
    },
    {
      title: "Progress",
      url: "/users/progress",
      icon: Activity,
    },
    {
      title: "Certificates",
      url: "/users/certificates",
      icon: Album,
    },
  ],
  
  teacher: [],
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Users,
    },
    {
      title: "Courses Taught",
      url: "/admin/courses_taught",
      icon: Book,
    },
    {
      title: "Student Progress",
      url: "/admin/student_progress",
      icon: Activity,
    },
  ],
};



export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
