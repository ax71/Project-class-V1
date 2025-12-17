"use client";

import { useState, useEffect } from "react";
import { EllipsisVertical, LogOut, User as UserIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from "@/constants/sidebar-constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { EditProfileDialog } from "@/app/(dashboard)/users/_components/edit-profile";

interface User {
  name: string;
  email: string;
  avatar_url?: string;
  role: string;
}

export function AppSidebar({
  user,
  ...props
}: { user: User } & React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const auth = useAuth();

  // 1. STATE AWAL: WAJIB pakai data Server (props 'user')
  // JANGAN baca localStorage di sini!
  const [userData, setUserData] = useState({
    name: user?.name || "Guest",
    email: user?.email || "",
    role: (user?.role || "user") as SidebarMenuKey,
    avatarUrl: user?.avatar_url || "",
  });

  // 2. USE EFFECT: Baru baca localStorage setelah halaman tampil (Client Only)
  useEffect(() => {
    // Ambil data terbaru dari browser storage atau context
    const localUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;

    const contextUser = auth?.user;

    // Jika ada data lokal yang lebih baru, update state
    if (localUser || contextUser) {
      setUserData({
        name: contextUser?.name || localUser?.name || user?.name || "Guest",
        email: contextUser?.email || localUser?.email || user?.email || "",
        role: (contextUser?.role ||
          localUser?.role ||
          user?.role ||
          "user") as SidebarMenuKey,
        avatarUrl:
          contextUser?.avatar_url ||
          localUser?.avatar_url ||
          user?.avatar_url ||
          "",
      });
    }
  }, [auth?.user, user]); // Dependency array penting

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    auth?.logout?.();
    router.push("/login");
  };

  return (
    <>
      <EditProfileDialog
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        currentUser={{ name: userData.name, email: userData.email }}
      />

      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="font-bold">
                  <div className="p-2 flex items-center justify-center rounded-md">
                    <Image
                      src="/Icon.svg"
                      alt="Positivus"
                      width={42}
                      height={42}
                    />
                  </div>
                  Positivus
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
              <SidebarMenu>
                {/* Render menu berdasarkan Role */}
                {/* Jika role berubah di client, React akan re-render list ini dengan aman */}
                {SIDEBAR_MENU_LIST[userData.role]?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        className={cn("px-4 py-3 h-auto", {
                          "bg-sky-500 text-white hover:bg-sky-500 hover:text-white":
                            pathname === item.url,
                        })}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      {/* Gunakan key agar React merender ulang Avatar jika URL berubah */}
                      <AvatarImage
                        key={userData.avatarUrl}
                        src={userData.avatarUrl}
                        alt={userData.name}
                      />
                      {/* suppressHydrationWarning mencegah error jika text beda server/client */}
                      <AvatarFallback
                        className="rounded-lg"
                        suppressHydrationWarning
                      >
                        {userData.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="leading-tight">
                      <h4
                        className="truncate font-medium"
                        suppressHydrationWarning
                      >
                        {userData.name}
                      </h4>
                      <p className="truncate text-xs text-muted-foreground">
                        {userData.role}
                      </p>
                    </div>

                    <EllipsisVertical className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="min-w-56 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center px-1">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={userData.avatarUrl}
                          alt={userData.name}
                        />
                        <AvatarFallback
                          className="rounded-lg"
                          suppressHydrationWarning
                        >
                          {userData.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <h4
                          className="truncate font-medium"
                          suppressHydrationWarning
                        >
                          {userData.name}
                        </h4>
                        <p className="truncate text-xs text-muted-foreground">
                          {userData.role}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
