import {
  SlidersHorizontal,
  ChevronsUpDown,
  Languages,
  Moon,
  Sun,
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
import { t, translateCategory, translateSubcategory } from "../../utils/i18n";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
  mapType: "winter-v4" | "streets-v4" | "dataviz-v4";
  onMapTypeChange: (value: "winter-v4" | "streets-v4" | "dataviz-v4") => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (value: string) => void;
  onCategorySelectAll: () => void;
  onCategoryDeselectAll: () => void;
  selectedSubcategory: string;
  onSubcategoryChange: (value: string) => void;
  categories: string[];
  categoryCounts: Map<string, number>;
  subcategories: string[];
}

const SidebarLogo = ({ language }: { language: "en" | "fr" | "ar" }) => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-sm bg-primary/5">
            <img src="/favicon.svg" alt={t(language, "siteTitle")} className="size-full object-cover" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-medium">{t(language, "siteTitle")}</span>
            <span className="text-xs text-muted-foreground">{t(language, "siteSubtitle")}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const LanguageSelector = ({
  language,
  onLanguageChange,
  isRtl,
}: {
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
  isRtl: boolean;
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
              <div className={cn("grid flex-1 text-sm leading-tight", isRtl ? "text-right" : "text-left")}>
                <span className="truncate font-medium">{t(language, "preferredLanguage")}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {t(language, "currentLanguage", { code: language.toUpperCase() })}
                </span>
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
                  <span className="truncate font-medium">{t(language, "selectDisplayLanguage")}</span>
                  <span className="truncate text-xs text-muted-foreground">{t(language, "appliesAcrossPlatform")}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLanguageChange("en")}>
              {t(language, "languageEn")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange("fr")}>
              {t(language, "languageFr")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange("ar")}>
              {t(language, "languageAr")}
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
  theme,
  onThemeToggle,
  search,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  onCategorySelectAll,
  onCategoryDeselectAll,
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
  theme: "light" | "dark";
  onThemeToggle: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (value: string) => void;
  onCategorySelectAll: () => void;
  onCategoryDeselectAll: () => void;
  selectedSubcategory: string;
  onSubcategoryChange: (value: string) => void;
  categories: string[];
  categoryCounts: Map<string, number>;
  subcategories: string[];
}) => {
  const [filtersOpenOnMobile, setFiltersOpenOnMobile] = React.useState(false);
  const isRtl = language === "ar";

  return (
    <Sidebar
      collapsible="none"
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "!h-auto !w-full overflow-visible border-b md:!h-svh md:!max-h-svh md:!w-[--sidebar-width] md:overflow-hidden md:border-b-0",
        isRtl ? "text-right" : "text-left",
      )}
      {...props}
    >
      <SidebarHeader>
        <SidebarLogo language={language} />
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted md:hidden",
            isRtl ? "self-end" : "self-start",
          )}
          onClick={() => setFiltersOpenOnMobile((value) => !value)}
          aria-expanded={filtersOpenOnMobile}
          aria-controls="mobile-filter-panel"
        >
          <SlidersHorizontal className="size-4" />
          {filtersOpenOnMobile ? t(language, "filtersHide") : t(language, "filtersShow")}
        </button>
      </SidebarHeader>
      <SidebarContent
        id="mobile-filter-panel"
        className={cn(
          "overflow-visible md:flex md:overflow-hidden",
          filtersOpenOnMobile ? "flex" : "hidden",
        )}
      >
        <ScrollArea className="h-auto min-h-0 flex-1 md:h-full">
          <SidebarGroup className="h-auto min-h-0 md:h-full">
            <SidebarGroupLabel className={cn(isRtl ? "w-full text-right" : "")}>{t(language, "searchFilters")}</SidebarGroupLabel>
            <SidebarGroupContent className="flex min-h-0 flex-col gap-3 md:flex-1">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t(language, "mapType")}</div>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={mapType}
                  onChange={(event) =>
                    onMapTypeChange(event.target.value as "winter-v4" | "streets-v4" | "dataviz-v4")
                  }
                >
                  <option value="winter-v4">{t(language, "mapTypeWinter")}</option>
                  <option value="streets-v4">{t(language, "mapTypeStreets")}</option>
                  <option value="dataviz-v4">{t(language, "mapTypeDataviz")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t(language, "searchLabel")}</div>
                <Input
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder={t(language, "searchPlaceholder")}
                />
              </div>

              <div className="flex min-h-0 flex-col space-y-2 md:flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">{t(language, "categoryLabel")}</div>
                  <div className="flex flex-wrap items-center gap-1">
                    <button
                      type="button"
                      className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
                      onClick={onCategorySelectAll}
                    >
                      {t(language, "selectAll")}
                    </button>
                    <button
                      type="button"
                      className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
                      onClick={onCategoryDeselectAll}
                    >
                      {t(language, "deselectAll")}
                    </button>
                  </div>
                </div>
                <div className="max-h-72 space-y-1 overflow-y-auto pr-1 md:min-h-0 md:max-h-none md:flex-1">
                  {categories.map((category) => {
                    const categoryColor = getCategoryColorHex(category);
                    const isSelected = selectedCategories.includes(category);
                    const categoryLabel = translateCategory(language, category);

                    return (
                      <button
                        key={category}
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition hover:bg-muted/60 md:px-1.5 md:py-1 md:text-xs",
                          isRtl ? "flex-row-reverse text-right" : "text-left",
                        )}
                        onClick={() => onCategoryToggle(category)}
                        aria-pressed={isSelected}
                      >
                        <span
                          className="inline-flex size-4 shrink-0 items-center justify-center rounded-sm border text-[10px] font-bold leading-none"
                          style={{
                            borderColor: categoryColor,
                            backgroundColor: isSelected ? categoryColor : "transparent",
                            color: isSelected ? "#ffffff" : categoryColor,
                          }}
                        >
                          {isSelected ? "✓" : ""}
                        </span>
                        <span className="text-sm md:text-xs">
                          {categoryLabel} ({categoryCounts.get(category) ?? 0})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">{t(language, "subcategoryLabel")}</div>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={selectedSubcategory}
                  onChange={(event) => onSubcategoryChange(event.target.value)}
                >
                  <option value="all">{t(language, "allSubcategories")}</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {translateSubcategory(language, subcategory)}
                    </option>
                  ))}
                </select>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className={cn(filtersOpenOnMobile ? "flex" : "hidden", "md:flex")}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={onThemeToggle}
              aria-label={t(language, "toggleTheme")}
              title={t(language, "toggleTheme")}
            >
              <div className="flex size-8 items-center justify-center rounded-lg border">
                {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{t(language, "themeLabel")}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {theme === "dark" ? t(language, "themeDark") : t(language, "themeLight")}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} isRtl={isRtl} />
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
  theme,
  onThemeToggle,
  search,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  onCategorySelectAll,
  onCategoryDeselectAll,
  selectedSubcategory,
  onSubcategoryChange,
  categories,
  categoryCounts,
  subcategories,
}: AppShellProps) {
  return (
    <SidebarProvider className={cn("flex-col md:flex-row", className)}>
      <AppSidebar
        language={language}
        onLanguageChange={onLanguageChange}
        mapType={mapType}
        onMapTypeChange={onMapTypeChange}
        theme={theme}
        onThemeToggle={onThemeToggle}
        search={search}
        onSearchChange={onSearchChange}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
        onCategorySelectAll={onCategorySelectAll}
        onCategoryDeselectAll={onCategoryDeselectAll}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={onSubcategoryChange}
        categories={categories}
        categoryCounts={categoryCounts}
        subcategories={subcategories}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col p-2 sm:p-3 md:p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
