import InfraType from '#models/infra_type'
import User from '#models/user'
import BasePolicy from './base_policy.js'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class InfraTypePolicy extends BasePolicy {
    view(user: User): AuthorizerResponse {
        return true
    }

    create(user: User): AuthorizerResponse {
        return true
    }
  
    edit(user: User, site?: InfraType): AuthorizerResponse {
        return true
    }
    
    delete(user: User, site?: InfraType): AuthorizerResponse {
        return true
    }
}