import type { HttpContext } from '@adonisjs/core/http';
import SettingsPolicy from '#policies/settings_policy'; // Import policy

export default class SettingsController {
    async index({inertia, bouncer}: HttpContext) {
        if (await bouncer.with(SettingsPolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        return inertia.render('settings', {});
    }
}
