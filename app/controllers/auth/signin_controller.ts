import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import {
  storeSigninValidator
} from '#validators/signin'

export default class SigninController {
  
  async show({inertia}: HttpContext) {
    return inertia.render('auth', {});
  }
  
  async store({ request, auth, response, session, inertia }: HttpContext) {
    const data = request.all()
    const payload = await storeSigninValidator.validate(data)

    /**
     * Step 1: Get credentials from the request body
     */
    const { email, password } = request.only(['email', 'password'])
    /**
     * Step 2: Verify credentials
     */
    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      return inertia.location('/dashboard')
      // return response.redirect('/dashboard')
    } catch (err) {
      console.log(err.message)
      session.flash('errors', {
        result: {
          code: err.code,
          message: 'Please double check your email and password'
        }
      })
      // return response.redirect('/dashboard')
      return response.redirect().back()
    }

    /**
     * Step 3: Login user
     */
    // await auth.use('web').login(user)

    /**
     * Step 4: Send them to a protected route
     */
    // return response.redirect('/dashboard')
    return inertia.location('/dashboard')
  }

  async out({inertia, auth, response}: HttpContext) {
    await auth.use('web').logout()
    // return response.redirect('/auth')
    return inertia.location('/auth')
    // return inertia.render('signin', {});
  }
  
}