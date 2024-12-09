import vine from '@vinejs/vine'

export const storeInfraTypeValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
    })
  )