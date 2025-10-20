import { Activity, Album, Book, Users } from "lucide-react";

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
      url: "/user/progress",
      icon: Activity,
    },
    {
      title: "Certificates",
      url: "/user/certificates",
      icon: Album,
    },
  ],
  admin: [],
  teacher: [],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
