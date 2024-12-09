import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { TableName } from '../../types/tables.ts'
import { randomUUID } from 'node:crypto'

export default class Attr extends BaseModel {
  static table = TableName.attr

  static get jsonAttributes() {
    return ['options'];
  }

  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare code: string

  @column()
  declare uuid: string

  @column()
  declare name: string

  @column()
  declare type: string

  @column({ prepare: value => JSON.stringify(value) })
  declare options: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeCreate()
  static assignUuid(attr: Attr) {
    if (!attr.code) {
      attr.code = randomUUID()
    }
    if (!attr.uuid) {
      attr.uuid = randomUUID()
    }
  }
}