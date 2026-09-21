document.addEventListener('DOMContentLoaded', () => {
   const modal = document.getElementById('modal');
   if (!modal) return;

   document.querySelectorAll('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', () => {
         modal.classList.add('is-open');
         document.body.style.overflow = 'hidden';
      });
   });

   modal.querySelectorAll('[data-modal-close]').forEach((el) => {
      el.addEventListener('click', () => {
         modal.classList.remove('is-open');
         document.body.style.overflow = '';
      });
   });

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
         modal.classList.remove('is-open');
         document.body.style.overflow = '';
      }
   });

   const phoneInput = document.querySelector('#phone-input');
   let iti = null;

   if (phoneInput && window.intlTelInput) {
      iti = window.intlTelInput(phoneInput, {
         initialCountry: 'ru',
         preferredCountries: ['ru', 'kz', 'by', 'ua'],
         separateDialCode: false,
         autoPlaceholder: 'aggressive',
         utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js'
      });
   }

   const form = modal.querySelector('.modal__form');
   if (form) {
      form.addEventListener('submit', async (e) => {
         e.preventDefault();

         const nameValue = form.querySelector('input[name="name"]').value.trim();
         const phoneValue = iti ? iti.getNumber() : (phoneInput ? phoneInput.value : '');

         if (!nameValue) {
               alert('Пожалуйста, укажите имя');
               return;
         }

         if (!phoneValue || phoneValue.replace(/\D/g, '').length < 10) {
               alert('Пожалуйста, введите корректный номер телефона');
               return;
         }

         const btn = form.querySelector('button[type="submit"]');
         const originalText = btn.textContent;
         btn.textContent = 'Отправляем...';
         btn.disabled = true;

         try {
               const response = await fetch(form.action, {
                  method: 'POST',
                  headers: {
                     'Accept': 'application/json',
                     'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                     name: nameValue,
                     phone: phoneValue
                  })
               });

               if (response.ok) {
                  alert(`Спасибо, ${nameValue}! Мы свяжемся с Вами в ближайшее время.`);
                  form.reset();
                  if (iti) iti.setCountry('ru');
                  modal.classList.remove('is-open');
                  document.body.style.overflow = '';
               } else {
                  const error = await response.json().catch(() => ({}));
                  alert('Что-то пошло не так. Попробуйте ещё раз.');
                  console.error('Formspree error:', error);
               }
         } catch (err) {
               alert('Ошибка сети. Проверьте соединение с интернетом.');
               console.error('Network error:', err);
         } finally {
               btn.textContent = originalText;
               btn.disabled = false;
         }
      });
   }
});