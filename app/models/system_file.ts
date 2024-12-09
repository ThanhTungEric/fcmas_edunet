import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { TableName } from '../../types/tables.ts'

import { compose } from '@adonisjs/core/helpers'
import { attachment, Attachmentable } from '@jrmc/adonis-attachment'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import InfraType from '#models/infra_type'
import Infra from './infra.ts'

export default class SystemFile extends compose(BaseModel, Attachmentable) {
  static table = TableName.systemFile

  @column({ isPrimary: true })
  declare id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare refUuid: string

  @column()
  declare refType: string

  @column()
  declare url: string

  @belongsTo(() => InfraType, {foreignKey: 'uuid'})
  declare infraType: BelongsTo<typeof InfraType>

  @belongsTo(() => Infra, {foreignKey: 'uuid'})
  declare infra: BelongsTo<typeof Infra>

  @attachment({}) 
  declare attachment: Attachment
}