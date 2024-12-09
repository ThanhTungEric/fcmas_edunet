import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import { TableName } from '../../types/tables.ts'
import { randomUUID } from 'node:crypto'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Attr from '#models/attr'
import SystemFile from '#models/system_file'

export default class InfraType extends BaseModel {
  static table = TableName.infraType

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare uuid: string

  @column()
  declare description: string

  @column()
  declare left: number

  @column()
  declare right: number

  @column()
  declare depth: number

  @column()
  declare parentId: number

  @column()
  declare options: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // @hasMany(() => InfraTypeAttachment, {foreignKey: 'infratypeId'})
  // declare attachments: HasMany<typeof InfraTypeAttachment>

  @hasMany(() => SystemFile, {foreignKey: 'refUuid', localKey: 'uuid'})
  declare attachments: HasMany<typeof SystemFile>

  @manyToMany(() => Attr, {
    pivotColumns: ['options'],
    pivotTable: TableName.attrInfraType,
    localKey: 'id',
    pivotForeignKey: 'infratype_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'attr_id',
    pivotTimestamps: true
  })
  declare attrs: ManyToMany<typeof Attr>

  @beforeCreate()
  static assignUuid(infraType: InfraType) {
    if (!infraType.code) {
      infraType.code = randomUUID()
    }
    if (!infraType.uuid) {
      infraType.uuid = randomUUID()
    }
  }
}