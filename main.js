document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.main-nav a');

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  const modal = document.getElementById('contact-modal');
  const openButton = document.getElementById('open-contact-form');
  const closeButton = document.getElementById('close-contact-form');
  const form = document.getElementById('inquiry-form');

  if (openButton && modal) {
    openButton.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  const closeModal = () => {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target && event.target.hasAttribute('data-close')) {
        closeModal();
      }
    });
  }

  if (form) {
    const statusElement = document.getElementById('form-status');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const statusText = statusElement || null;

      try {
        statusText && (statusText.textContent = 'Sending your message...');

        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          statusText && (statusText.textContent = 'Thank you. Your message has been sent successfully.');
          form.reset();
          closeModal();
          return;
        }

        throw new Error('Submission failed');
      } catch (error) {
        const name = (formData.get('name') || '').toString().trim();
        const phone = (formData.get('contact') || '').toString().trim();
        const email = (formData.get('email') || '').toString().trim();
        const description = (formData.get('description') || '').toString().trim();

        const subject = encodeURIComponent('SKS Academy Inquiry');
        const body = encodeURIComponent(
          [
            `Name: ${name}`,
            `Contact Number: ${phone}`,
            `Email: ${email}`,
            '',
            'Description:',
            description
          ].join('\n')
        );

        statusText && (statusText.textContent = 'The form could not send directly. Please use your email app to send the message.');
        window.location.href = `mailto:sdrkhandiur@gmail.com?subject=${subject}&body=${body}`;
      }
    });
  }
});
