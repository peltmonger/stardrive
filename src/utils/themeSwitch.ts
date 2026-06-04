import { get, set } from '@/utils/localStorage';
import type { UserTheme } from '~/types/user-theme';

/**
 * Inline script run synchronously in <head> before first paint to prevent theme flash.
 * Must be self-contained (no imports) - injected via `set:html` in base.astro.
 */
export const THEME_INIT_SCRIPT = `(function(){var t=localStorage.getItem('user-theme');` + `if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches))` + `{document.documentElement.classList.add('dark')}})();`;

function getSystemPreference(): UserTheme {
  // check for the system and fall back to light
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export const getUserTheme = (): UserTheme => {
  // try to get the theme from local storage
  let theme = get('user-theme') as UserTheme;
  if (!theme) {
    theme = getSystemPreference();
    set('user-theme', theme);
  }
  // adjust the class on the html element accordingly before returning the theme
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return theme;
};

export const setUserTheme = (theme: UserTheme) => {
  // save the theme to local storage
  set('user-theme', theme);
  // adjust the class on the html element
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
