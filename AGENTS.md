# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# Theme Modification Rules

1. When the user requests theme-specific work (e.g. "테마3 작업이야"), apply visual styling changes ONLY to that specific theme (e.g. `theme3Neon` in `themeColors.ts` or theme3-scoped logic) without affecting other themes' colors, positions, or component layouts.
2. Only modify common component positions/layouts or update all themes (e.g., Theme 1, Theme 2, Theme 3) simultaneously when the user explicitly instructs to do so (e.g., "테마1, 테마2도 함께 적용해줘").

