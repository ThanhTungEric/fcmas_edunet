import User from '#models/user'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import BasePolicy from './base_policy.js'

export default class DashboardPolicy extends BasePolicy {
    view(user: User): AuthorizerResponse {
        if (user.permissions && user.permissions['user_per_1']) {
            return user.permissions['user_per_1'];
        }
        return false
    }
}