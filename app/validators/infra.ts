import vine from '@vinejs/vine'

export const storeInfraValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        typeId: vine.number(),
    })
  )