const $form = document.querySelector('form');
const $fileInput = document.querySelector('#file-input');
const $uploadButton = document.querySelector('.upload-button')

const errors = {
  avatar: '',
  email: ''
}

function init() {
  initEvents()
}

function initEvents() {
  $form.addEventListener('submit', onSubmit);
  setupFileUpload()
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
  const $emailInfoError = $email.nextElementSibling

  validateForm({ email: $email.value })

  $email.dataset.error = errors.email || '';
  $emailInfoError.classList.toggle('hidden', !errors.email);
  $emailInfoError.querySelector('.error-text').textContent = errors.email;
  
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

function setupFileUpload() {
  $uploadButton.addEventListener('click', () => $fileInput.click())
  $fileInput.addEventListener('change', () => handleFileSelection($fileInput))
}

// function setupDragAndDrop()

function handleFileSelection ($fileInput) {
  if ($fileInput.files.length === 0) return

  const file = $fileInput.files[0]

  if (file.size > 512000) {
    errors.avatar = 'File too large. Please upload a photo under 500KB'
    
    $fileInput.value = ''
  } else {
    errors.avatar = ''
  } 
}


init()