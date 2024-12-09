import type { HttpContext } from '@adonisjs/core/http'
import SitePolicy from '#policies/site_policy'
import Site from '#models/site'

export default class SitesController {
    async index({inertia, bouncer}: HttpContext) {
        if (await bouncer.with(SitePolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        const sites = await Site.all()
        return inertia.render('sites/index', {
            sites: sites,
            can: {
                create: await bouncer.with(SitePolicy).allows('create'),
                edit: await bouncer.with(SitePolicy).allows('edit'),
            }
        })
    }

    async create({inertia, bouncer}: HttpContext) {
        if (await bouncer.with(SitePolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        return inertia.render('sites/create', {
            
        })
    }

    async store({inertia, bouncer, request, response}: HttpContext) {
        if (await bouncer.with(SitePolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        console.log('vao day nhe')
        const invoiceDocuments = request.files('attachments')
    
        for (let document of invoiceDocuments) {
        console.log(document)
        }
        
        // return response.redirect('/dashboard')
        return response.redirect().back()
        return inertia.render('sites/create', {
            
        })
    }
}