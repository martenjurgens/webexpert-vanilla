import './style.css'
import { User } from './types/types.ts'

const storedUsersData = sessionStorage.getItem('users')
const usersData = storedUsersData ? JSON.parse(storedUsersData) : []

const searchInput = document.getElementById('search') as HTMLInputElement

searchInput.addEventListener('input', (event: any) => {
  const filteredUsers = usersData?.filter((user: User) =>
    user.name.toLowerCase().includes(event.target.value.toLowerCase())
  )
  displayUsers(filteredUsers)
})

if (!storedUsersData) {
  fetchData()
} else {
  displayUsers(usersData)
}

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

  usersSection.innerHTML = ''

  users?.forEach((user: User) => {
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
