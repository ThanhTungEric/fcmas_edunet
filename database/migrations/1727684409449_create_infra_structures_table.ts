import { BaseSchema } from '@adonisjs/lucid/schema'
import { TableName } from '../../types/tables.ts'

export default class extends BaseSchema {
  protected tableNames: string[] = [
    TableName.systemFile,
    TableName.infraTypeAttachment,
    TableName.infraAttachement,
    TableName.infraTypeVersion,
    TableName.attrInfraType,
    TableName.attrInfra,
    TableName.attr,
    TableName.infra,
    TableName.infraType
  ]

  async up() {

    this.schema.createTable(TableName.systemFile, (table) => {
      table.increments('id')
      table.string('ref_uuid').nullable()
      table.string('ref_type').nullable()
      table.json('attachment')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(TableName.infraType, (table) => {
      table.increments('id')
      table.string('name')
      table.string('code', 50)
      table.uuid('uuid')
      table.text('description').nullable()
      table.integer('left').unsigned().defaultTo(0)
      table.integer('right').unsigned().defaultTo(0)
      table.integer('depth').unsigned().defaultTo(0)
      table.integer('parent_id').unsigned().defaultTo(0)
      table.json('options').defaultTo({})
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // this.schema.createTable(TableName.infraTypeAttachment, (table) => {
    //   table.increments('id')
    //   table.integer('infratype_id').unsigned().references(`${TableName.infraType}.id`).onDelete('CASCADE')
    //   table.json('attachment')
    //   table.timestamp('created_at')
    //   table.timestamp('updated_at')
    // })

    this.schema.createTable(TableName.attr, (table) => {
      table.increments('id')
      table.string('name')
      table.string('code', 50)
      table.uuid('uuid')
      table.string('type', 20)
      table.json('options').defaultTo({})
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(TableName.attrInfraType, (table) => {
      table.increments('id')
      table.integer('infratype_id').unsigned().references(`${TableName.infraType}.id`)
      table.integer('attr_id').unsigned().references(`${TableName.attr}.id`)
      table.unique(['infratype_id', 'attr_id'])
      table.json('options').defaultTo({})
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    this.schema.createTable(TableName.infra, (table) => {
      table.increments('id')
      table.string('name')
      table.string('code', 50)
      table.uuid('uuid')
      table.string('url')
      table.integer('type_id').unsigned().references(`${TableName.infraType}.id`)
      table.integer('os_id').unsigned()
      table.integer('version_id').unsigned()
      table.integer('slave_id').unsigned()
      table.string('ip')
      table.integer('port').unsigned()
      table.integer('parent_id').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })

    this.schema.createTable(TableName.infraTypeVersion, (table) => {
      table.increments('id')
      table.integer('parent_id').defaultTo(0)
      table.string('name')
      table.string('code', 50)
      table.uuid('uuid')
      table.integer('type_id').unsigned().references(`${TableName.infraType}.id`)
      table.json('attrs').defaultTo({})
      table.text('attrs_string').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.timestamp('deleted_at')
    })

    // this.schema.createTable(TableName.infraAttachement, (table) => {
    //   table.increments('id')
    //   table.integer('infra_id').unsigned().references(`${TableName.infra}.id`).onDelete('CASCADE')
    //   table.json('attachment')
    //   table.timestamp('created_at')
    //   table.timestamp('updated_at')
    // })

    this.schema.createTable(TableName.attrInfra, (table) => {
      table.increments('id')
      table.integer('infra_id').unsigned().references(`${TableName.infra}.id`)
      table.integer('attr_id').unsigned().references(`${TableName.attr}.id`)
      table.unique(['infra_id', 'attr_id'])
      table.json('value').defaultTo({})
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.integer('updated_by').unsigned().defaultTo(0)
    })
  }

  async down() {
    this.tableNames.forEach(tableName => {
      console.log(`Drop table ${tableName}`)
      this.schema.dropTableIfExists(tableName)
    })
  }
}