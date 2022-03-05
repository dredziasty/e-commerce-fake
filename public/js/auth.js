const loginAction = document.querySelector('.login-action')
const loginForm = document.querySelector('.login-form')
const registerAction = document.querySelector('.register-action')
const registerForm = document.querySelector('.register-form')
const logoutAction = document.querySelector('.logout-action')
const logoutForm = document.querySelector('.logout-form')
const popup = document.querySelector('.popup')
const usernamePlaceholder = document.querySelector('.username-data')

const classes = {
  popupShow: 'popup-show'
}

const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const displayPopup = async(message, type = 'default', ms = 2000) => {
  popup.textContent = message
  popup.classList.add(classes.popupShow)
  popup.classList.add(`popup-${type}`)

  await timeout(ms)

  popup.textContent = ''
  popup.classList.remove(classes.popupShow)
  popup.classList.add(`popup-${type}`)
}

loginAction.addEventListener('click', async() => {
  try {
    const formData = new FormData(loginForm)
    const email = formData.get('email')
    const password = formData.get('password')

    const result = await axios.post('/api/auth/login', {
      email,
      password
    })

    if (result.status === 200) {
      localStorage.setItem('user', JSON.stringify({
        id: result.data.userId,
        firstname: result.data.firstname
      }))

      loginForm.reset()
        // await displayPopup('Successfully logged in. Redirecting.')
      location.reload()
    }
  } catch (error) {
    console.error(error)
  }
})

registerAction.addEventListener('click', async() => {
  try {
    const formData = new FormData(registerForm)
    const email = formData.get('email')
    const password = formData.get('password')
    const firstname = formData.get('firstname')
    const lastname = formData.get('lastname')

    const result = await axios.post('/api/auth/register', {
      email,
      password,
      firstname,
      lastname
    })

    if (result.status === 201) {
      registerForm.reset()
      await displayPopup('Pomyślnie zarejestrowano.', 'info')
    }
  } catch (error) {
    console.error(error)
  }
})

logoutAction.addEventListener('click', async() => {
  localStorage.removeItem('user')
  await axios.post('/api/auth/logout')
  await displayPopup('Pomyślnie wylogowano. Przekierowuję.', 'info')
  location.reload()
})

window.addEventListener('load', () => {
  const user = JSON.parse(localStorage.getItem('user'))

  if (user) {
    loginForm.style.display = 'none'
    registerForm.style.display = 'none'
    logoutForm.style.display = 'block'
    usernamePlaceholder.textContent = user.firstname
  }
})