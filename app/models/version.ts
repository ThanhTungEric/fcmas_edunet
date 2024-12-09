import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany, manyToMany, belongsTo } from '@adonisjs/lucid/orm'
import { TableName } from '../../types/tables.ts'
import { randomUUID } from 'node:crypto'
import type { HasMany, ManyToMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Attr from '#models/attr'
import InfraType from '#models/infra_type'

export default class InfraTypeVersion extends BaseModel {
  static table = TableName.infraTypeVersion

  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare uuid: string

  @column()
  declare parentId: number

  @column()
  declare typeId: number

  @column()
  declare attrs_string: string

  @column({ prepare: value => JSON.stringify(value) })
  declare attrs: object

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime({})
  declare deletedAt: DateTime

  @belongsTo(() => InfraType, {foreignKey: 'typeId'})
  declare type: BelongsTo<typeof InfraType>

  // @manyToMany(() => Attr, {
  //   pivotColumns: ['value', 'updated_by'],
  //   pivotTable: TableName.attrInfra,
  //   localKey: 'id',
  //   pivotForeignKey: 'infra_id',
  //   relatedKey: 'id',
  //   pivotRelatedForeignKey: 'attr_id',
  //   pivotTimestamps: true
  // })
  // declare attrs: ManyToMany<typeof Attr>

  @beforeCreate()
  static assignUuid(infra: InfraTypeVersion) {
    if (!infra.code) {
      infra.code = randomUUID()
    }
    if (!infra.uuid) {
      infra.uuid = randomUUID()
    }
  }
}