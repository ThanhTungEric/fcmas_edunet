import type { HttpContext } from '@adonisjs/core/http';
import User from '#models/user'; // Import model User
import UserPolicy from '#policies/users_policy';

export default class UsersController {
    async index({ inertia, bouncer }: HttpContext) {
        // Kiểm tra quyền truy cập
        if (await bouncer.with(UserPolicy).denies('view')) {
            return inertia.render('errors/access_denied', {});
        }

        // Lấy danh sách người dùng từ cơ sở dữ liệu
        const users = await User.all();
        // Render template với danh sách người dùng
        return inertia.render('users', {
            users: users, // Truyền danh sách người dùng vào template
        });
    }
}
