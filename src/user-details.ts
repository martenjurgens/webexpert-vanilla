import { User } from './types/types'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const userIdParam = urlParams.get('id')
const userId = userIdParam ? parseInt(userIdParam) : null

const storedUsersData = sessionStorage.getItem('users')

if (!storedUsersData) {
  window.location.href = `/`
}

const usersData = JSON.parse(storedUsersData as string)

const submitButton = document.querySelector('button[type="submit"]')

if (submitButton && !userId) {
  submitButton.innerHTML = 'Add user'
}

const form = document.getElementById('user-details') as HTMLFormElement
const nameInput = document.getElementById('name') as HTMLInputElement
const usernameInput = document.getElementById('username') as HTMLInputElement
const emailInput = document.getElementById('email') as HTMLInputElement
const phoneInput = document.getElementById('phone') as HTMLInputElement
const websiteInput = document.getElementById('website') as HTMLInputElement

form.addEventListener('submit', async (event) => {
  event.preventDefault()

  const updatedUser: User = {
    id: userId ?? getNextUserid(),
    name: nameInput.value,
    username: nameInput.value,
    email: nameInput.value,
    phone: nameInput.value,
    website: nameInput.value,
  }

  if (userId) {
    updateUserDetails(updatedUser)
  } else {
    addUser(updatedUser)
    window.location.href = `/`
  }
})

if (userId) {
  getUserData()
}

function getNextUserid() {
  const lastUserId = usersData.reduce(
    (highestId: number, user: User) =>
      user.id > highestId ? user.id : highestId,
    0
  )

  return lastUserId + 1
}

async function getUserData() {
  if (!userIdParam) {
    return
  }

  const user = usersData.find((user: User) => user.id === userId)
  displayUserDetails(user)
}

async function displayUserDetails(user?: User) {
  const deleteButton = document.getElementById('delete-button')

  if (deleteButton && userId && user) {
    deleteButton.removeAttribute('hidden')
    deleteButton.addEventListener('click', (event) => {
      deleteUser(user.id)
      window.location.href = `/`
    })
  }

  if (user) {
    nameInput.value = user.name
    usernameInput.value = user.username
    emailInput.value = user.email
    phoneInput.value = user.phone
    websiteInput.value = user.website
  }
}

function updateUserDetails(updatedUser: User) {
  const storedUsersData = sessionStorage.getItem('users')
  const usersData = storedUsersData ? JSON.parse(storedUsersData) : []

  const user = usersData.find((user: User) => user.id === updatedUser.id)

  const userIndex = usersData.findIndex(
    (storedUser: User) => storedUser.id === user.id
  )

  if (userIndex !== -1) {
    usersData[userIndex] = {
      ...user,
      ...updatedUser,
    }

    sessionStorage.setItem('users', JSON.stringify(usersData))
  }
}

function addUser(addedUser: User) {
  const storedUsersData = sessionStorage.getItem('users')
  const usersData = storedUsersData ? JSON.parse(storedUsersData) : []

  usersData.push(addedUser)

  sessionStorage.setItem('users', JSON.stringify(usersData))
}

function deleteUser(userId: number) {
  const storedUsersData = sessionStorage.getItem('users')
  const usersData = storedUsersData ? JSON.parse(storedUsersData) : []

  const updatedUsers = usersData.filter((user: User) => user.id !== userId)

  sessionStorage.setItem('users', JSON.stringify(updatedUsers))
}
