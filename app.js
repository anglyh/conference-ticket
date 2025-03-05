const $defaultTitle = document.querySelector('header .title:first-of-type')
const $ticketTitle = document.querySelector('header .title:last-of-type')

const $main = document.querySelector('main')
const $ticketSection = document.querySelector('section');

const $form = document.querySelector('form');
const $fileInput = document.querySelector('#file-input');
const $uploadButton = document.querySelector('.upload-button')
const $removeImgButton = document.querySelector('#remove-btn')
const $changeImgButton = document.querySelector('#change-btn')
const $avatarPreview = document.querySelector('#avatar-preview')
const $uploadInfo = document.querySelector('.upload-container .info');
const $uploadInfoText = $uploadInfo.querySelector('.text');

const $userFullname = document.querySelector('#fullname')
const $userEmail = document.querySelector('#email');

const $userAvatar = document.querySelector('#user-avatar');
const $userFullnameTicket = document.querySelector('#user-fullname');
const $userGithub = document.querySelector('#user-github');

const CONFIG = {
  maxFileSize: 512000,
  allowedFileTypes: ['image/jpeg', 'image/png'],
  errorMessages: {
    fileRequired: 'Please upload a profile photo',
    fileSize: 'File too large. Please upload a photo under 500KB.',
    fileType: 'Invalid file type. Please upload JPG or PNG files only',
    emailRequired: 'Email address is required',
    emailInvalid: 'Please enter a valid email address.',
    fullNameRequired: 'Please enter your name',
    githubRequired: 'Please enter your github username'
  },
  emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
}

const formData = {
  fullName: '',
  email: '',
  githubUsername: '',
  avatar: null
}

const errors = {
  avatar: '',
  fullName: '',
  email: '',
  github: '',
}

function init() {
  initEvents()
}

function initEvents() {
  $form.addEventListener('submit', onSubmit);

  $uploadButton.addEventListener('click', onClickUploadButton)
  $fileInput.addEventListener('change', handleFileSelection)
  $uploadButton.addEventListener('dragover', onDragOver)
  $uploadButton.addEventListener('drop', onDrop)
  $uploadButton.addEventListener('dragleave', onDragLeave)
  $changeImgButton.addEventListener('click', onClickUploadButton)
  $removeImgButton.addEventListener('click', onRemoveImage)
}

function onSubmit(event) {
  event.preventDefault();

  const { elements } = event.currentTarget;
  const $fullName = elements.namedItem('full_name');
  const $email = elements.namedItem('email')
  const $githubUsername = elements.namedItem('username');
  const $avatar = elements.namedItem('avatar');
  const avatar = $avatar.files[0]
  
  validateFormData($email, $fullName, $githubUsername)
  validateFile(avatar)

  if (errors.email || errors.avatar || errors.fullName || errors.github) return

  formData.fullName = $fullName.value.trim();
  formData.email = $email.value.trim();
  formData.githubUsername = $githubUsername.value.trim();

  displayTicket(formData)
}

function validateFormData($email, $fullName, $githubUsername) {
  clearError('email');
  clearError('fullName');
  clearError('github')

  if (!$email.value.trim()) {
    setError('email', CONFIG.errorMessages.emailRequired)
  } else if (!CONFIG.emailPattern.test($email.value)) {
    setError('email', CONFIG.errorMessages.emailInvalid)
  }

  $email.dataset.error = errors.email || '';
  const $emailInfoError = $email.nextElementSibling
  $emailInfoError.classList.toggle('hidden', !errors.email);
  $emailInfoError.querySelector('.text').textContent = errors.email;

  if (!$fullName.value.trim()) {
    setError('fullName', CONFIG.errorMessages.fullNameRequired)
  }

  $fullName.dataset.error = errors.fullName || '';
  const $fullNameInfoError = $fullName.nextElementSibling
  $fullNameInfoError.classList.toggle('hidden', !errors.fullName)
  $fullNameInfoError.querySelector('.text').textContent = errors.fullName

  if (!$githubUsername.value.trim()) {
    setError('github', CONFIG.errorMessages.githubRequired)
  }

  $githubUsername.dataset.error = errors.github || '';
  const $githubUsernameInfoError = $githubUsername.nextElementSibling
  $githubUsernameInfoError.classList.toggle('hidden', !errors.github)
  $githubUsernameInfoError.querySelector('.text').textContent = errors.github
}

function onClickUploadButton() {
  $fileInput.click();
}

function handleFileSelection() {
  clearError('avatar');
  if ($fileInput.files.length === 0) return
  const file = $fileInput.files[0]

  if (!validateFile(file)) return;

  updateFileSuccessUI();

  const reader = new FileReader()
  reader.onload = (event) => {
    const imgSrc = event.target.result;
    $avatarPreview.src = imgSrc;
    formData.avatar = imgSrc;
  }
  reader.readAsDataURL(file)
  disableFileUpload()
}

function validateFile(file) {
  if (!file) {
    setError('avatar', CONFIG.errorMessages.fileRequired)
    resetFileInput();
    updateFileErrorUI()
    return false
  }

  if (!CONFIG.allowedFileTypes.includes(file.type)) {
    setError('avatar', CONFIG.errorMessages.fileType)
    resetFileInput()
    updateFileErrorUI()
    return false
  }

  if (file.size > CONFIG.maxFileSize) {
    setError('avatar', CONFIG.errorMessages.fileSize);
    resetFileInput();
    updateFileErrorUI()
    return false
  }

  return true
}

function updateFileSuccessUI() {
  $uploadInfo.classList.remove('error')
  $uploadInfoText.textContent = 'Upload your photo (JPG or PNG, max size: 500KB).'
  $uploadButton.classList.add('uploaded');
}

function updateFileErrorUI() {
  $uploadInfo.classList.add('error');
  $uploadInfoText.textContent = errors.avatar;
}

function resetFileInput() {
  $fileInput.value = ''
}

function enableFileUpload() {
  $uploadButton.addEventListener('click', onClickUploadButton)
  $uploadButton.addEventListener('dragover', onDragOver)
  $uploadButton.addEventListener('drop', onDrop)
  $uploadButton.addEventListener('dragleave', onDragLeave)
}

function disableFileUpload() {
  $uploadButton.removeEventListener('click', onClickUploadButton)
  $uploadButton.removeEventListener('dragover', onDragOver)
  $uploadButton.removeEventListener('drop', onDrop)
  $uploadButton.removeEventListener('dragleave', onDragLeave)
}

function onDragOver(event) {
  event.preventDefault();
  $uploadButton.classList.add('dragging')
  console.log('dragging')
}

function onDrop(event) {
  event.preventDefault()
  $uploadButton.classList.remove('dragging')
  
  if (event.dataTransfer.files.length === 0) return
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(event.dataTransfer.files[0])
  console.log('dataTransfer', dataTransfer)
  $fileInput.files = dataTransfer.files

  handleFileSelection()
}

function onDragLeave(event) {
  event.preventDefault()
  $uploadButton.classList.remove('dragging')
}

function onRemoveImage(event) {
  event.stopPropagation();
  
  $fileInput.value = ''
  $uploadButton.classList.remove('uploaded')
  $avatarPreview.src = 'assets/images/icon-upload.svg'
  enableFileUpload()
}

function setError(field, message) {
  errors[field] = message
}

function clearError(field) {
  errors[field] = ''
}

function displayTicket(formData) {
  $userFullname.textContent = formData.fullName
  $userEmail.textContent = formData.email

  $userAvatar.src = formData.avatar
  $userFullnameTicket.textContent = formData.fullName
  $userGithub.textContent = formData.githubUsername

  $defaultTitle.classList.add('hidden')
  $main.classList.add('hidden')
  
  $ticketTitle.classList.remove('hidden')
  $ticketSection.classList.remove('hidden')
}

init()