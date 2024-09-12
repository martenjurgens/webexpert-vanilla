import './style.css'
import { User } from './types/types.ts'

async function fetchData() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json()
    sessionStorage.setItem('users', JSON.stringify(data))
    displayUsers(data)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

async function displayUsers(users: User[]) {
  const usersSection =
    document.querySelector<HTMLButtonElement>('.users-section')!
  users.forEach((user: User) => {
    const userDiv = document.createElement('div')
    userDiv.classList.add('user-card')

    const userCardContent = document.createElement('div')
    userCardContent.classList.add('user-card-content')

    userCardContent.innerHTML = `
        <h2>${user.name}</h2>
        <p> ${user.username}</p>
        <p>${user.email}</p>
        <button>Details</button>
      `

    userDiv.appendChild(userCardContent)

    usersSection.appendChild(userDiv)

    const button = userCardContent.querySelector<HTMLButtonElement>('button')!
    button.addEventListener('click', (event) => {
      window.location.href = `/user-details.html?id=${user.id}`
    })
  })
}

const storedUsersData = sessionStorage.getItem('users')

if (!storedUsersData) {
  fetchData()
} else {
  const usersData = JSON.parse(storedUsersData)
  displayUsers(usersData)
}
