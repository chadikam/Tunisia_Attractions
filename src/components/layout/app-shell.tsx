import {
  ChevronRight,
  ChevronsUpDown,
  Compass,
  Globe2,
  Languages,
  Map,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  activeView: "explore" | "map";
  onViewChange: (view: "explore" | "map") => void;
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedSubcategory: string;
  onSubcategoryChange: (value: string) => void;
  categories: string[];
  subcategories: string[];
}

const SidebarLogo = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">
            <Globe2 className="size-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">Tunisia Explorer</span>
            <span className="text-xs text-muted-foreground">Tourism Platform</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const LanguageSelector = ({
  language,
  onLanguageChange,
}: {
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
}) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <Languages className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Preferred Language</span>
                <span className="truncate text-xs text-muted-foreground">Current: {language.toUpperCase()}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <Languages className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Select Display Language</span>
                  <span className="truncate text-xs text-muted-foreground">Applies across the platform</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLanguageChange("en")}>
              EN - English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange("fr")}>
              FR - Francais
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange("ar")}>
              AR - Arabic
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const AppSidebar = ({
  activeView,
  onViewChange,
  language,
  onLanguageChange,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  activeView: "explore" | "map";
  onViewChange: (view: "explore" | "map") => void;
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
}) => {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className="flex w-full items-center">
                      <Compass className="size-4" />
                      <span>Explore</span>
                      <ChevronRight className="ml-auto size-3 text-muted-foreground" />
                    </div>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={activeView === "explore"}>
                        <a
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            onViewChange("explore");
                          }}
                        >
                          Landing
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <div className="flex w-full items-center">
                      <Map className="size-4" />
                      <span>Map</span>
                      <ChevronRight className="ml-auto size-3 text-muted-foreground" />
                    </div>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={activeView === "map"}>
                        <a
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            onViewChange("map");
                          }}
                        >
                          Tunisia Map View
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export function AppShell({
  children,
  className,
  activeView,
  onViewChange,
  language,
  onLanguageChange,
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedSubcategory,
  onSubcategoryChange,
  categories,
  subcategories,
}: AppShellProps) {
  const breadcrumbs =
    activeView === "explore"
      ? [
          { label: "Platform", href: "#" },
          { label: "Explore" },
        ]
      : [
          { label: "Platform", href: "#" },
          { label: "Map View" },
        ];

  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar
        activeView={activeView}
        onViewChange={onViewChange}
        language={language}
        onLanguageChange={onLanguageChange}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 hidden data-[orientation=vertical]:h-4 md:block"
          />
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-primary">
              <Globe2 className="size-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Tunisia Explorer</span>
          </div>
          <Breadcrumb className="hidden md:block">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.label}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {i === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href || "#"}>{crumb.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Button variant={language === "en" ? "secondary" : "ghost"} size="sm" onClick={() => onLanguageChange("en")}>EN</Button>
            <Button variant={language === "fr" ? "secondary" : "ghost"} size="sm" onClick={() => onLanguageChange("fr")}>FR</Button>
            <Button variant={language === "ar" ? "secondary" : "ghost"} size="sm" onClick={() => onLanguageChange("ar")}>AR</Button>
          </div>
        </header>

        <div className="border-b px-4 py-3">
          <div className="grid gap-3 md:grid-cols-4">
            <Input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by EN / FR / AR"
              className="md:col-span-2"
            />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={selectedSubcategory}
              onChange={(event) => onSubcategoryChange(event.target.value)}
            >
              <option value="all">All subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Languages className="size-3.5" />
            Names display in selected language; search matches EN/FR/AR.
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
