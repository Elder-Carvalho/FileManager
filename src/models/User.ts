export default class User {
  id: number
  name: string
  email: string
  role: number
  folder: string
  password: string

  constructor(id: number, name: string, email: string, role: number, folder: string, password: string) {
    this.id = id
    this.name = name
    this.email = email
    this.role = role
    this.folder = folder
    this.password = password
  }
}