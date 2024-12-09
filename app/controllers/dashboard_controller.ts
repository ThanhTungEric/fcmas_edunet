import type { HttpContext } from '@adonisjs/core/http'
import DashboardPolicy from '#policies/dashboard_policy';

export default class DashboardController {
    async index({inertia, bouncer}: HttpContext) {
        if (await bouncer.with(DashboardPolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        return inertia.render('dashboard', {});
    }
}