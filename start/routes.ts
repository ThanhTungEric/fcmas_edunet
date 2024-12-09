/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from '#start/kernel'
import SigninController from '#controllers/auth/signin_controller'
import router from '@adonisjs/core/services/router'
import DashboardController from '#controllers/dashboard_controller'
import InfraTypesController from '#controllers/infra_types_controller'
import InfrasController from '#controllers/infra_controller'
import InfraApi from '#apis/infra_api'

import SettingsController from '#controllers/settings_controller' // Import SettingsController

import UserController from '#controllers/users_controller'


router.group(() => {
    // router.on('/').renderInertia('dashboard').as('admin.home')
    // router.on('/dashboard').renderInertia('dashboard').as('admin.dashboard')
    router.get('/', [DashboardController, 'index']).as('admin.home')
    router.get('/dashboard', [DashboardController, 'index']).as('admin.dashboard')

    // infra types group
    router.group(() => {
        router.get('/', [InfraTypesController, 'index']).as('admin.infra_types.index')
        router.get('/attrs/:id', [InfraTypesController, 'attrs']).as('admin.infras.attrs')
        router.post('/', [InfraTypesController, 'store']).as('admin.infra_types.store')
        router.get('/create', [InfraTypesController, 'create']).as('admin.infra_types.create')
        router.get('/edit/:id', [InfraTypesController, 'edit']).as('admin.infra_types.edit')
        router.put('/:id', [InfraTypesController, 'update']).as('admin.infra_types.update')
        router.delete('/:id', [InfraTypesController, 'destroy']).as('admin.infra_types.destroy')
    }).prefix('/infra-types').as('admin.infra_types')

    // infra group
    router.group(() => {
        router.get('/circuit-diagrams/:id/:url', [InfrasController, 'diagrams']).as('admin.infras.diagrams')
        router.get('/attrs/:id', [InfrasController, 'attrs']).as('admin.infras.attrs')
        router.get('/create/:parentId?', [InfrasController, 'create']).as('admin.infras.create')
        router.get('/edit/:id', [InfrasController, 'edit']).as('admin.infras.edit')
        router.get('/detail/:id/:pageId?', [InfrasController, 'detail']).as('admin.infras.detail')
        router.get('/:pageId?', [InfrasController, 'index']).as('admin.infras.index')
        router.post('/', [InfrasController, 'store']).as('admin.infras.store')
        router.put('/:id', [InfrasController, 'update']).as('admin.infras.update')
        router.delete('/:id', [InfrasController, 'destroy']).as('admin.infras.destroy')
    }).prefix('/infras').as('admin.infras')

    // Group settings
    router.group(() => {
        router.get('/', [SettingsController, 'index']).as('admin.settings.index')

    }).prefix('/settings').as('admin.settings')

    // Group users
    router.group(() => {
        router.get('/', [UserController, 'index']).as('admin.users.index')
    }).prefix('/users').as('admin.users')

}).as('admin').use(middleware.auth()).use(middleware.sidebar())

router.group(() => {
    router.get('/auth', [SigninController, 'show']).as('auth.show')
    router.post('/auth', [SigninController, 'store']).as('auth.store')
    router.get('/signin', [SigninController, 'show']).as('login.show')
    router.post('/signin', [SigninController, 'store']).as('login.store')
    router.get('/signout', [SigninController, 'out']).as('login.out').use(middleware.auth())
}).as('auth')

router.group(() => {
    router.post('/infras', [InfraApi, 'store']).as('collector.infras.store')
    router.get('/infra-types', [InfraApi, 'infraTypes']).as('collector.infras.types')
}).prefix('collector').as('collector')