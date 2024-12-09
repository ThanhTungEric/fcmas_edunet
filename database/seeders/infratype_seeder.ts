import { BaseSeeder } from '@adonisjs/lucid/seeders'
import InfraType from '#models/infra_type'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await InfraType.createMany([
      {
        id: 1,
        name: 'Building',
        code: 'BUILDING',
        description: 'Mô tả building',
        parentId: 0
      },
      {
        id: 2,
        name: 'Site',
        code: 'SITE',
        description: 'Mô tả site',
        parentId: 1
      },
      {
        id: 3,
        name: 'System',
        code: 'SYSTEM',
        description: 'Mô tả system',
        parentId: 2
      },
      {
        id: 4,
        name: 'Function',
        code: 'FUNCTION',
        description: 'Mô tả function',
        parentId: 3
      },
      {
        id: 5,
        name: 'Unit',
        code: 'UNIT',
        description: 'Mô tả unit',
        parentId: 4
      },
    ])
  }
}