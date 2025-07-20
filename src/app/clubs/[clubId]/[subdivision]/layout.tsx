import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "@/components/header";
import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Rocket, Home } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export default function SubdivisionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { clubId: string, subdivision: string };
}) {
    const resolvedParams = use(Promise.resolve(params));
    const clubName = decodeURIComponent(resolvedParams.clubId).replace(/-/g, ' ');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href={`/clubs/${resolvedParams.clubId}`} title="Back to subdivisions">
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                  </Button>
                <div className="flex flex-col">
                    <h2 className="text-sm font-semibold text-foreground capitalize">
                        {clubName}
                    </h2>
                    <h1 className="text-lg font-bold text-primary capitalize">
                        {resolvedParams.subdivision}
                    </h1>
                </div>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/clubs" title="Back to clubs">
                  <Home className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <MainNav clubId={resolvedParams.clubId} subdivision={resolvedParams.subdivision} />
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
