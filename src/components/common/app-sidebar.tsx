"use client";

import { EllipsisVertical, LogOut } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext"; // ← jika kamu pakai AuthContext

export function AppSidebar() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  // === Ambil data user ===
  const auth = useAuth();
  const contextUser = auth?.user;

  // fallback jika tidak pakai AuthContext
  const localUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const user = contextUser || localUser;

  const name = user?.name ?? "Guest";
  const role = (user?.role ?? "user") as SidebarMenuKey;
  const avatarUrl = user?.avatar_url ?? "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // kalau pakai AuthContext
    auth?.logout?.();

    router.push("/login");
  };

  return (
    <Sidebar>
      {/* HEADER */}
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

      {/* MENU LIST */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col-4 gap-2">
            <SidebarMenu>
              {SIDEBAR_MENU_LIST[role]?.map((item) => (
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

      {/* FOOTER / USER */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={avatarUrl} alt={name} />
                    <AvatarFallback className="rounded-lg">
                      {name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="leading-tight">
                    <h4 className="truncate font-medium">{name}</h4>
                    <p className="truncate text-xs text-muted-foreground">
                      {role}
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
                      <AvatarImage src={avatarUrl} alt={name} />
                      <AvatarFallback className="rounded-lg">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <h4 className="truncate font-medium">{name}</h4>
                      <p className="truncate text-xs text-muted-foreground">
                        {role}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
