import {
  ChevronsUpDown,
  Globe2,
  Languages,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
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
  SidebarProvider,
} from "../ui/sidebar";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { getCategoryColorHex } from "../../constants/place-category-colors";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
  mapType: "winter-v4" | "streets-v4" | "dataviz-v4";
  onMapTypeChange: (value: "winter-v4" | "streets-v4" | "dataviz-v4") => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (value: string) => void;
  selectedSubcategory: string;
  onSubcategoryChange: (value: string) => void;
  categories: string[];
  categoryCounts: Map<string, number>;
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
  language,
  onLanguageChange,
  mapType,
  onMapTypeChange,
  search,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedSubcategory,
  onSubcategoryChange,
  categories,
  categoryCounts,
  subcategories,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
  mapType: "winter-v4" | "streets-v4" | "dataviz-v4";
  onMapTypeChange: (value: "winter-v4" | "streets-v4" | "dataviz-v4") => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (value: string) => void;
  selectedSubcategory: string;
  onSubcategoryChange: (value: string) => void;
  categories: string[];
  categoryCounts: Map<string, number>;
  subcategories: string[];
}) => {
  return (
    <Sidebar collapsible="none" className="min-h-svh" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Search & Filters</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Map Type</div>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={mapType}
                  onChange={(event) =>
                    onMapTypeChange(event.target.value as "winter-v4" | "streets-v4" | "dataviz-v4")
                  }
                >
                  <option value="winter-v4">Winter</option>
                  <option value="streets-v4">Streets</option>
                  <option value="dataviz-v4">Dataviz</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Search</div>
                <Input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search by EN / FR / AR"
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Category</div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition ${selectedCategories.includes(category) ? "shadow-sm" : "opacity-75 hover:opacity-100"}`}
                      style={{
                        borderColor: getCategoryColorHex(category),
                        color: selectedCategories.includes(category) ? getCategoryColorHex(category) : undefined,
                        backgroundColor: selectedCategories.includes(category)
                          ? `${getCategoryColorHex(category)}1A`
                          : undefined,
                      }}
                      onClick={() => onCategoryToggle(category)}
                    >
                      <span
                        className="inline-block size-2 rounded-full"
                        style={{ backgroundColor: getCategoryColorHex(category) }}
                      />
                      <span>{category}</span>
                      <span className="text-[10px]">({categoryCounts.get(category) ?? 0})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Subcategory</div>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </SidebarFooter>
    </Sidebar>
  );
};

export function AppShell({
  children,
  className,
  language,
  onLanguageChange,
  mapType,
  onMapTypeChange,
  search,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedSubcategory,
  onSubcategoryChange,
  categories,
  categoryCounts,
  subcategories,
}: AppShellProps) {
  return (
    <SidebarProvider className={cn(className)}>
      <AppSidebar
        language={language}
        onLanguageChange={onLanguageChange}
        mapType={mapType}
        onMapTypeChange={onMapTypeChange}
        search={search}
        onSearchChange={onSearchChange}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={onSubcategoryChange}
        categories={categories}
        categoryCounts={categoryCounts}
        subcategories={subcategories}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
