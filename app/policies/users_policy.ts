import User from '#models/user'
import BasePolicy from './base_policy.js'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class UsersPolicy extends BasePolicy {
    view(user: User): AuthorizerResponse {
        return true
    }

    create(user: User): AuthorizerResponse {
        return true
    }

}