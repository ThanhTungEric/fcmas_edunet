import vine from '@vinejs/vine';

export const storeUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    email: vine.string().trim().email(),
    password: vine.string().trim().minLength(6),
  })
);
