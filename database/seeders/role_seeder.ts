import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      {
        id: 1,
        name: 'Manager'
      },
      {
        id: 2,
        name: 'Monitor'
      },
    ])
  }
}