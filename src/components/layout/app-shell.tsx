import {
  SlidersHorizontal,
  ChevronsUpDown,
  Languages,
  Moon,
  Sun,
  ChevronRight,
  Search,
  Map,
  Layers,
  Filter,
  History,
  Trees,
  Palette,
  FerrisWheel,
  Tag,
  Settings,
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
import { CATEGORY_GROUPS, translateGroupLabel } from "../../constants/category-groups";

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

/* ------------------------------------------------------------------ */
/*  Logo                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Settings Selector (Theme + Language)                              */
/* ------------------------------------------------------------------ */

const SettingsSelector = ({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  isRtl,
}: {
  language: "en" | "fr" | "ar";
  onLanguageChange: (language: "en" | "fr" | "ar") => void;
  theme: "light" | "dark";
  onThemeToggle: () => void;
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
                  <Settings className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className={cn("grid flex-1 text-sm leading-tight", isRtl ? "text-right" : "text-left")}>
                <span className="truncate font-medium">{t(language, "preferences")}</span>
                <span className="truncate text-xs text-muted-foreground uppercase">
                  {theme} · {language}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-lg" side="bottom" align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <Settings className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t(language, "preferences")}</span>
                  <span className="truncate text-xs text-muted-foreground">{t(language, "appliesAcrossPlatform")}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                {t(language, "themeLabel")}
              </div>
              <DropdownMenuItem onClick={onThemeToggle} className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
                  <span>{theme === "dark" ? t(language, "themeDark") : t(language, "themeLight")}</span>
                </div>
                <div className="text-[9px] bg-muted px-1.5 py-0.5 rounded font-bold uppercase">Switch</div>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            <div className="p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">
                {t(language, "preferredLanguage")}
              </div>
              <DropdownMenuItem 
                onClick={() => onLanguageChange("en")}
                className={cn("cursor-pointer", language === "en" && "bg-accent text-accent-foreground font-medium")}
              >
                {t(language, "languageEn")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onLanguageChange("fr")}
                className={cn("cursor-pointer", language === "fr" && "bg-accent text-accent-foreground font-medium")}
              >
                {t(language, "languageFr")}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onLanguageChange("ar")}
                className={cn("cursor-pointer", language === "ar" && "bg-accent text-accent-foreground font-medium")}
              >
                {t(language, "languageAr")}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

/* ------------------------------------------------------------------ */
/*  Map Type Toggle (3 inline buttons)                                */
/* ------------------------------------------------------------------ */

const MAP_TYPES: { value: "winter-v4" | "streets-v4" | "dataviz-v4"; labelKey: "mapTypeWinter" | "mapTypeStreets" | "mapTypeDataviz" }[] = [
  { value: "winter-v4", labelKey: "mapTypeWinter" },
  { value: "streets-v4", labelKey: "mapTypeStreets" },
  { value: "dataviz-v4", labelKey: "mapTypeDataviz" },
];

const MapTypeToggle = ({
  language,
  mapType,
  onMapTypeChange,
}: {
  language: "en" | "fr" | "ar";
  mapType: "winter-v4" | "streets-v4" | "dataviz-v4";
  onMapTypeChange: (value: "winter-v4" | "streets-v4" | "dataviz-v4") => void;
}) => (
  <div className="grid grid-cols-3 gap-1 rounded-lg border bg-muted/30 p-1">
    {MAP_TYPES.map(({ value, labelKey }) => (
      <button
        key={value}
        type="button"
        className={cn(
          "rounded-md px-2 py-1.5 text-xs font-medium transition-all",
          mapType === value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        )}
        onClick={() => onMapTypeChange(value)}
      >
        {t(language, labelKey)}
      </button>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Collapsible Category Group                                        */
/* ------------------------------------------------------------------ */

const getGroupIcon = (name: string) => {
  switch (name) {
    case "history": return History;
    case "nature": return Trees;
    case "culture": return Palette;
    case "leisure": return FerrisWheel;
    case "other": return Tag;
    default: return Tag;
  }
};

interface CategoryGroupSectionProps {
  groupId: string;
  groupColor: string;
  groupCategories: string[];
  iconName: string;
  allCategories: string[];
  selectedCategories: string[];
  categoryCounts: Map<string, number>;
  language: "en" | "fr" | "ar";
  isRtl: boolean;
  onCategoryToggle: (category: string) => void;
}

const CategoryGroupSection = ({
  groupId,
  groupColor,
  groupCategories,
  iconName,
  allCategories,
  selectedCategories,
  categoryCounts,
  language,
  isRtl,
  onCategoryToggle,
}: CategoryGroupSectionProps) => {
  const [expanded, setExpanded] = React.useState(false);
  const Icon = getGroupIcon(iconName);

  // Only show categories that actually exist in the data
  const presentCategories = groupCategories.filter((c) => allCategories.includes(c));
  if (presentCategories.length === 0) return null;

  const selectedCount = presentCategories.filter((c) => selectedCategories.includes(c)).length;
  const totalCount = presentCategories.length;
  const allSelected = selectedCount === totalCount;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  // Group-level count (sum of all category counts in this group)
  const groupTotalCount = presentCategories.reduce(
    (sum, c) => sum + (categoryCounts.get(c) ?? 0),
    0,
  );

  const handleGroupToggle = () => {
    if (allSelected) {
      // Deselect all in group
      presentCategories.forEach((c) => {
        if (selectedCategories.includes(c)) {
          onCategoryToggle(c);
        }
      });
    } else {
      // Select all in group
      presentCategories.forEach((c) => {
        if (!selectedCategories.includes(c)) {
          onCategoryToggle(c);
        }
      });
    }
  };

  return (
    <div className="space-y-0.5">
      {/* Group header row */}
      <div className={cn("flex items-center gap-1", isRtl ? "flex-row-reverse" : "")}>
        {/* Expand/collapse chevron */}
        <button
          type="button"
          className="flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          <ChevronRight
            className={cn("size-3.5 transition-transform duration-200", expanded && "rotate-90")}
          />
        </button>

        {/* Group checkbox */}
        <button
          type="button"
          className={cn(
            "flex flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 text-xs font-semibold transition hover:bg-muted/60",
            isRtl ? "flex-row-reverse text-right" : "text-left",
          )}
          onClick={handleGroupToggle}
        >
          <span
            className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm border text-[9px] font-bold leading-none"
            style={{
              borderColor: groupColor,
              backgroundColor: allSelected ? groupColor : someSelected ? groupColor + "55" : "transparent",
              color: allSelected || someSelected ? "#ffffff" : groupColor,
            }}
          >
            {allSelected ? "✓" : someSelected ? "–" : ""}
          </span>
          <span className="flex-1 truncate flex items-center gap-1.5">
            <Icon className="size-3.5 opacity-70" />
            {translateGroupLabel(language, groupId)}
          </span>
          {/* Show count only when the group is actively being used (partially selected) */}
          {someSelected || allSelected ? (
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {groupTotalCount}
            </span>
          ) : null}
        </button>
      </div>

      {expanded && (
        <div className={cn(
          "relative space-y-0.5 mt-1 mb-2",
          isRtl ? "mr-4" : "ml-4"
        )}>
          {presentCategories.map((category) => {
            const categoryColor = getCategoryColorHex(category);
            const isSelected = selectedCategories.includes(category);
            const categoryLabel = translateCategory(language, category);
            const count = categoryCounts.get(category) ?? 0;

            return (
              <button
                key={category}
                type="button"
                className={cn(
                  "relative flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-xs transition hover:bg-muted/60",
                  isRtl ? "flex-row-reverse text-right pr-8" : "text-left pl-8",
                )}
                onClick={() => onCategoryToggle(category)}
                aria-pressed={isSelected}
              >
                <span
                  className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm border text-[9px] font-bold leading-none"
                  style={{
                    borderColor: categoryColor,
                    backgroundColor: isSelected ? categoryColor : "transparent",
                    color: isSelected ? "#ffffff" : categoryColor,
                  }}
                >
                  {isSelected ? "✓" : ""}
                </span>
                <span className="flex-1 truncate">{categoryLabel}</span>
                {/* Show count only when this category is selected */}
                {isSelected ? (
                  <span className="text-[10px] tabular-nums text-muted-foreground">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Section Heading utility                                           */
/* ------------------------------------------------------------------ */

const SectionHeading = ({
  icon: Icon,
  children,
  isRtl,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  isRtl: boolean;
}) => (
  <div className={cn(
    "flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80",
    isRtl ? "flex-row-reverse" : "",
  )}>
    <Icon className="size-3.5" />
    <span>{children}</span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Sidebar Separator                                                 */
/* ------------------------------------------------------------------ */

const SidebarSeparator = () => (
  <div className="mx-2 border-t border-border/60" />
);

/* ------------------------------------------------------------------ */
/*  Main Sidebar                                                      */
/* ------------------------------------------------------------------ */

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
          <div className="flex min-h-0 flex-col gap-4 p-3 md:flex-1">

            {/* ── Map Style ────────────────────────────────── */}
            <div className="space-y-2">
              <SectionHeading icon={Map} isRtl={isRtl}>
                {t(language, "mapType")}
              </SectionHeading>
              <MapTypeToggle
                language={language}
                mapType={mapType}
                onMapTypeChange={onMapTypeChange}
              />
            </div>

            <SidebarSeparator />

            {/* ── Search ───────────────────────────────────── */}
            <div className="space-y-2">
              <SectionHeading icon={Search} isRtl={isRtl}>
                {t(language, "searchLabel")}
              </SectionHeading>
              <Input
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder={t(language, "searchPlaceholder")}
                className="h-8 text-xs"
              />
            </div>

            <SidebarSeparator />

            {/* ── Categories ───────────────────────────────── */}
            <div className="flex min-h-0 flex-col space-y-2 md:flex-1">
              <div className="flex items-center justify-between">
                <SectionHeading icon={Layers} isRtl={isRtl}>
                  {t(language, "categoryLabel")}
                </SectionHeading>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-md border bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    onClick={selectedCategories.length === categories.length ? onCategoryDeselectAll : onCategorySelectAll}
                  >
                    {selectedCategories.length === categories.length ? t(language, "deselectAll") : t(language, "selectAll")}
                  </button>
                </div>
              </div>

              <div className="max-h-72 space-y-1 overflow-y-auto pr-0.5 md:min-h-0 md:max-h-none md:flex-1">
                {CATEGORY_GROUPS.map((group) => (
                  <CategoryGroupSection
                    key={group.id}
                    groupId={group.id}
                    groupColor={group.color}
                    groupCategories={group.categories}
                    iconName={group.iconName}
                    allCategories={categories}
                    selectedCategories={selectedCategories}
                    categoryCounts={categoryCounts}
                    language={language}
                    isRtl={isRtl}
                    onCategoryToggle={onCategoryToggle}
                  />
                ))}
              </div>
            </div>

            <SidebarSeparator />

            {/* ── Subcategory ──────────────────────────────── */}
            <div className="space-y-2">
              <SectionHeading icon={Filter} isRtl={isRtl}>
                {t(language, "subcategoryLabel")}
              </SectionHeading>
              <select
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
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
          </div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className={cn(filtersOpenOnMobile ? "flex" : "hidden", "md:flex")}>
        <SettingsSelector 
          language={language} 
          onLanguageChange={onLanguageChange} 
          theme={theme}
          onThemeToggle={onThemeToggle}
          isRtl={isRtl} 
        />
      </SidebarFooter>
    </Sidebar>
  );
};

/* ------------------------------------------------------------------ */
/*  Shell                                                             */
/* ------------------------------------------------------------------ */

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
