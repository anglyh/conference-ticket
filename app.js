const $form = document.querySelector('form');
const errors = {
  avatar: '',
  email: ''
}

function init() {
  initEvents()
}

function initEvents() {
  $form.addEventListener('submit', onSubmit);
}

function onSubmit(event) {
  event.preventDefault();
  // const formData = new FormData(event.target);
  // const fullName = formData.get('full_name');
  // const email = formData.get('email');
  // const username = formData.get('username');

  const { elements } = event.currentTarget;
  const $fullName = elements.namedItem('full_name');
  const $email = elements.namedItem('email')
  const $emailFormError = $email.nextElementSibling

  validateForm({ email: $email.value })

  $email.dataset.error = errors.email || '';
  $emailFormError.classList.toggle('hidden', !errors.email);
  $emailFormError.querySelector('.error-text').textContent = errors.email;
  
  // console.log($emailFormError)
}

function validateForm({ email }) {
  errors.avatar = ''
  errors.email = ''
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }
}

init()