import vine from '@vinejs/vine'

export const storeSigninValidator = vine.compile(
    vine.object({
        email: vine.string().trim().minLength(6),
        password: vine.string().trim().minLength(4),
    })
  )