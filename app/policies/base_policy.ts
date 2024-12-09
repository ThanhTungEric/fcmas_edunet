import User from '#models/user'
import { BasePolicy as BouncerBasePolicy } from '@adonisjs/bouncer'
// import { AuthorizerResponse } from '@adonisjs/bouncer/types'
import type { Permisions } from '../types/Types.ts'

export default class BasePolicy extends BouncerBasePolicy {
    public async before(user: User | null) {
        if (user) {
            await user.load('role')
            let userPermisions: Permisions = {};
            for (const permission in user.permissions) {
                userPermisions[permission] = user.permissions[permission];
            }
            let allPermissions = Object.assign(user.role.permissions, userPermisions);
            user.permissions = allPermissions;
        }
        if (user && user.isAdmin) {
            return true
        }
    }
}