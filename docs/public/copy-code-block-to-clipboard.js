const copyToClipboard = (e) => {
  const checkIcon = e.currentTarget.querySelector('.check');
  const copyIcon = e.currentTarget.querySelector('.copy');

  const pre = e.currentTarget.parentElement.previousElementSibling;
  const code = pre.querySelector('code');
  const text = code.innerText;

  navigator.clipboard.writeText(text).then(
    () => {
      /* clipboard successfully set */

      // Fallback for browsers that don't support this API:
      if (!document.startViewTransition) {
        copyIcon.classList.toggle('hidden');
        checkIcon.classList.toggle('hidden');

        setTimeout(() => {
          copyIcon.classList.toggle('hidden');
          checkIcon.classList.toggle('hidden');
        }, 700);
        return;
      }

      copyIcon.classList.toggle('hidden');
      checkIcon.classList.toggle('hidden');

      setTimeout(() => {
        // With a transition:
        document.startViewTransition(() => {
          copyIcon.classList.toggle('hidden');
          checkIcon.classList.toggle('hidden');
        });
      }, 700);
    },
    () => {
      /* clipboard write failed */
      console.log('failed!');
    }
  );
};

Array.from(document.querySelectorAll('.copy-to-clipboard')).forEach(
  (element) => {
    element.addEventListener('click', copyToClipboard);
  }
);
