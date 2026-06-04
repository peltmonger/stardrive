import { onCleanup, onMount } from 'solid-js';

const LanguageSwitcher = () => {
  const getFocusable = () => {
    const el = document.getElementById('language-switcher');
    if (!el) return [];
    return Array.from(el.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  };

  const trapFocus = (event: KeyboardEvent) => {
    const switcher = document.getElementById('language-switcher');
    if (!switcher || switcher.classList.contains('hidden')) return;
    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    if (!focusable.length) return;

    event.preventDefault();
    const current = document.activeElement;
    const index = focusable.indexOf(current as HTMLElement);
    if (event.shiftKey) {
      const prev = index <= 0 ? focusable.length - 1 : index - 1;
      focusable.at(prev)?.focus();
    } else {
      const next = index === -1 || index === focusable.length - 1 ? 0 : index + 1;
      focusable.at(next)?.focus();
    }
  };

  const closeLanguageSelect = () => {
    const languageSwitcher = document.getElementById('language-switcher');
    if (!languageSwitcher || languageSwitcher.classList.contains('hidden')) return;
    languageSwitcher.classList.add('hidden');
    languageSwitcher.classList.remove('fixed');
    document.body.classList.remove('overflow-y-hidden');
    // Return focus to the trigger button in the footer
    (document.getElementById('open-language-menu') as HTMLElement | null)?.focus();
  };

  const openLanguageSelect = () => {
    const languageSwitcher = document.getElementById('language-switcher');
    if (!languageSwitcher) return;
    languageSwitcher.classList.add('fixed');
    languageSwitcher.classList.remove('hidden');
    document.body.classList.add('overflow-y-hidden');
  };

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeLanguageSelect();
  };

  const setupLanguageSelect = () => {
    document.getElementById('close-language-menu')?.addEventListener('click', closeLanguageSelect);
    document.getElementById('open-language-menu')?.addEventListener('click', openLanguageSelect);
    document.addEventListener('keyup', handleKeyup);
    document.addEventListener('keydown', trapFocus);
  };

  const cleanupLanguageSelect = () => {
    document.getElementById('close-language-menu')?.removeEventListener('click', closeLanguageSelect);
    document.getElementById('open-language-menu')?.removeEventListener('click', openLanguageSelect);
    document.removeEventListener('keyup', handleKeyup);
    document.removeEventListener('keydown', trapFocus);
  };

  const handleAfterSwap = () => {
    cleanupLanguageSelect();
    setupLanguageSelect();
  };

  onMount(() => {
    setupLanguageSelect();
    document.addEventListener('astro:after-swap', handleAfterSwap);
  });

  onCleanup(() => {
    cleanupLanguageSelect();
    document.removeEventListener('astro:after-swap', handleAfterSwap);
  });

  return null;
};

export default LanguageSwitcher;
