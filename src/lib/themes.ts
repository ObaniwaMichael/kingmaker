export const THEMES = [
  "midnight-code",
  "mocha",
  "tokyo",
  "dracula",
  "gruvbox",
  "light",
] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_LABELS: Record<ThemeName, string> = {
  "midnight-code": "Midnight Code",
  mocha: "Catppuccin Mocha",
  tokyo: "Tokyo Night",
  dracula: "Dracula",
  gruvbox: "Gruvbox",
  light: "Light",
};

export const WALLPAPERS = ["programmer", "mesh", "grid"] as const;
export type WallpaperName = (typeof WALLPAPERS)[number];

export const WALLPAPER_LABELS: Record<WallpaperName, string> = {
  programmer: "Programmer",
  mesh: "Gradient mesh",
  grid: "Grid",
};
