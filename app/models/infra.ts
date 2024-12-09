import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import { TableName } from '../../types/tables.ts'
import { randomUUID } from 'node:crypto'
import type { HasMany, ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Attr from '#models/attr'
import InfraType from '#models/infra_type'
import SystemFile from '#models/system_file'

export default class Infra extends BaseModel {
  static table = TableName.infra

  // public serializeExtras() {
  //   return {
  //     value: this.$extras.value
  //   }
  // }
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare url: string

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
  declare typeId: number

  @column()
  declare osId: number

  @column()
  declare versionId: number

  @column()
  declare slaveId: number

  @column()
  declare port: number

  @column()
  declare ip: string

  @column()
  declare options: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({})
  declare deletedAt: DateTime

  @belongsTo(() => InfraType, {foreignKey: 'typeId'})
  declare type: BelongsTo<typeof InfraType>

  @hasMany(() => SystemFile, {foreignKey: 'refUuid', localKey: 'uuid'})
  declare attachments: HasMany<typeof SystemFile>

  @manyToMany(() => Attr, {
    pivotColumns: ['value', 'updated_by'],
    pivotTable: TableName.attrInfra,
    localKey: 'id',
    pivotForeignKey: 'infra_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'attr_id',
    pivotTimestamps: true
  })
  declare attrs: ManyToMany<typeof Attr>

  @beforeCreate()
  static assignUuid(infra: Infra) {
    if (!infra.code) {
      infra.code = randomUUID()
    }
    if (!infra.uuid) {
      infra.uuid = randomUUID()
    }
  }
}