document.addEventListener('DOMContentLoaded', () => {

   const modal = document.getElementById('modal');
   
   if (modal) {
      // Открытие
      document.querySelectorAll('[data-modal-open]').forEach((btn) => {
         btn.addEventListener('click', () => {
               modal.classList.add('is-open');
               document.body.style.overflow = 'hidden';
         });
      });

      // Закрытие (крестик или оверлей)
      modal.querySelectorAll('[data-modal-close]').forEach((el) => {
         el.addEventListener('click', () => {
               modal.classList.remove('is-open');
               document.body.style.overflow = '';
         });
      });

      // Закрытие по Esc
      document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && modal.classList.contains('is-open')) {
               modal.classList.remove('is-open');
               document.body.style.overflow = '';
         }
      });

      // Инициализация intl-tel-input
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

      // Отправка формы
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
   }

   // ============================================================
   // БУРГЕР-МЕНЮ
   // ============================================================
   const burger = document.querySelector('.header__burger');
   const mobileMenu = document.getElementById('mobile-menu');

   if (burger && mobileMenu) {
      // Открытие / закрытие
      burger.addEventListener('click', () => {
         burger.classList.toggle('is-active');
         mobileMenu.classList.toggle('is-open');
         document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
      });

      // Закрытие при клике по ссылке
      mobileMenu.querySelectorAll('.mobile-menu__link').forEach((link) => {
         link.addEventListener('click', () => {
               burger.classList.remove('is-active');
               mobileMenu.classList.remove('is-open');
               document.body.style.overflow = '';
         });
      });

      // Закрытие по Esc
      document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
               burger.classList.remove('is-active');
               mobileMenu.classList.remove('is-open');
               document.body.style.overflow = '';
         }
      });
   }

});