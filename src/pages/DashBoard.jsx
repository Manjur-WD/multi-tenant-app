import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Analytics } from "../components/dashboard/Analytics"
import { RecentData } from "../components/dashboard/RecentData"
import LogoutDrop from "../components/LogoutDrop"
export default function DashBoard() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 justify-between shrink-0 items-center gap-2 bg-accent border rounded-2xl">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block text-xl">
                  <BreadcrumbLink href="#">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <LogoutDrop />
        </header>
        <section className="flex flex-1 flex-col gap-4 p-4 max-h-[85vh] overflow-auto">
          <Analytics />
          <RecentData />

        </section>
      </SidebarInset>
    </SidebarProvider>
  )
}