import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        fullName: 'Admin',
        email: 'leon.fullstack@gmail.com',
        password: '1234',
        isAdmin: true,
        roleId: 1
      },
      {
        fullName: 'Manager',
        email: 'manager@fcmas.com',
        password: '1234',
        roleId: 1,
        isAdmin: true
      },
      {
        fullName: 'Monitor',
        email: 'monitor@fcmas.com',
        password: '1234',
        roleId: 2
      }
    ])
  }
}