import { AppSidebar } from "@/components/common/app-sidebar";
import { DarkmodeToggle } from "@/components/common/darkmode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "./_components/dashboard-breadcrumb";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user_profile");

  if (!userCookie) {
    redirect("/login");
  }

  const user = JSON.parse(userCookie.value);

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex items-center justify-between gap-2 h-16 shrink-0 transition-[height,width] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="gap-2 flex items-center px-2">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DashboardBreadcrumb />
          </div>
          <div className="px-4">
            <DarkmodeToggle />
          </div>
        </header>
        <main className="flex-1 flex flex-col items-start gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
