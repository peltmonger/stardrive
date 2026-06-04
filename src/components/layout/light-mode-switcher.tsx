import { onCleanup, onMount } from 'solid-js';
import { getUserTheme, setUserTheme } from '@utils/themeSwitch';
import type { UserTheme } from '~types/user-theme';

const SWITCH_ID = 'color-mode-switch';

const LightModeSwitch = () => {
  const syncUi = (theme: UserTheme) => {
    const button = document.getElementById(SWITCH_ID);
    if (button) button.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  };

  const toggle = (isPointer: boolean) => {
    const next: UserTheme = getUserTheme() === 'dark' ? 'light' : 'dark';
    setUserTheme(next);
    syncUi(next);
    if (isPointer && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleClick = (event: MouseEvent) => {
    // Browsers synthesize a click with `detail === 0` when a button is
    // activated via the keyboard (Space / Enter). We still toggle, but
    // skip the blur so keyboard focus is preserved.
    toggle(event.detail !== 0);
  };

  const setup = () => {
    syncUi(getUserTheme());
    document.getElementById(SWITCH_ID)?.addEventListener('click', handleClick);
  };

  const cleanup = () => {
    document.getElementById(SWITCH_ID)?.removeEventListener('click', handleClick);
  };

  const handleAfterSwap = () => {
    cleanup();
    setup();
  };

  onMount(() => {
    setup();
    document.addEventListener('astro:after-swap', handleAfterSwap);
  });

  onCleanup(() => {
    cleanup();
    document.removeEventListener('astro:after-swap', handleAfterSwap);
  });

  return null;
};

export default LightModeSwitch;
