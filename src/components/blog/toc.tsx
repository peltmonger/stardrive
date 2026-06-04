import { onCleanup, onMount } from 'solid-js';

const Toc = () => {
  const openToC = () => {
    const tocOverlay = document.getElementById('toc-overlay');
    if (tocOverlay) {
      tocOverlay.classList.remove('hidden');
      tocOverlay.classList.add('fixed');
      document.body.classList.add('overflow-y-hidden');
    }
  };

  const closeToC = () => {
    const tocOverlay = document.getElementById('toc-overlay');
    if (tocOverlay) {
      tocOverlay.classList.add('hidden');
      tocOverlay.classList.remove('fixed');
      document.body.classList.remove('overflow-y-hidden');
    }
  };

  const handleKeyup = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeToC();
  };

  const setupToC = () => {
    document.getElementById('open-toc')?.addEventListener('click', openToC);
    document.getElementById('close-toc')?.addEventListener('click', closeToC);
    document.addEventListener('keyup', handleKeyup);
    document.querySelectorAll('.toc-link').forEach((link) => link.addEventListener('click', closeToC));
  };

  const cleanupToC = () => {
    document.getElementById('open-toc')?.removeEventListener('click', openToC);
    document.getElementById('close-toc')?.removeEventListener('click', closeToC);
    document.removeEventListener('keyup', handleKeyup);
    document.querySelectorAll('.toc-link').forEach((link) => link.removeEventListener('click', closeToC));
  };

  const handleAfterSwap = () => {
    cleanupToC();
    setupToC();
  };

  onMount(() => {
    setupToC();
    document.addEventListener('astro:after-swap', handleAfterSwap);
  });

  onCleanup(() => {
    cleanupToC();
    document.removeEventListener('astro:after-swap', handleAfterSwap);
  });

  return null;
};

export default Toc;
