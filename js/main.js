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
      form.addEventListener('submit', (e) => {
         e.preventDefault();

         const nameValue = form.querySelector('input[name="name"]').value.trim();
         const phoneValue = iti ? iti.getNumber() : phoneInput.value;

         if (!nameValue) {
               alert('Пожалуйста, укажите имя');
               return;
         }

         if (iti && !iti.isValidNumber()) {
               alert('Пожалуйста, введите корректный номер телефона');
               return;
         }

         alert(`Спасибо, ${nameValue}! Мы свяжемся с Вами по номеру ${phoneValue}.`);

         form.reset();
         if (iti) iti.setCountry('ru');
         modal.classList.remove('is-open');
         document.body.style.overflow = '';
      });
   }
});