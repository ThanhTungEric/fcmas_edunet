import type { HttpContext } from '@adonisjs/core/http'
import InfraTypePolicy from '#policies/infra_type_policy'
import InfraType from '#models/infra_type'
import { storeInfraTypeValidator } from '#validators/infra_type'
import { attachmentManager } from '@jrmc/adonis-attachment'
import Attr from '#models/attr'
import SystemFile from '#models/system_file'

type Tree = {
    id: number,
    parentId: number,
    label: string,
    children: Array<Tree>
}
const buildTree = (data: Array<any>, parentId = 0) => {
    let tree: Array<Tree> = [];
    data.forEach(item => {
        // Check if the item belongs to the current parent
        if (item.parentId === parentId) {
            // Recursively build the children of the current item
            let children = buildTree(data, item.id);
            // If children exist, assign them to the current item
            if (children.length) {
                item.children = children;
            }
            // Add the current item to the tree
            tree.push(item);
        }
    });
    return tree;
}

function buildStructureForTree(infraTypes: InfraType[]): Array<Tree> {
    let infraTypeData: Array<Tree> = [];
    infraTypes.forEach(infraType => {
        infraTypeData.push({
            id: infraType.id,
            parentId: infraType.parentId,
            label: infraType.name,
            children: []
        })
    })
    return infraTypeData
}

export default class InfraTypesController {
    async index({inertia, bouncer}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        let infraTypeData: Array<Tree> = [];
        const infraTypes = await InfraType.all()
        infraTypeData = buildStructureForTree(infraTypes)
        const infraTypeTree = buildTree(infraTypeData)

        return inertia.render('infra_types/index', {
            infraTypeTree: infraTypeTree,
            can: {
                create: await bouncer.with(InfraTypePolicy).allows('create'),
                edit: await bouncer.with(InfraTypePolicy).allows('edit'),
            }
        })
    }

    async create({inertia, bouncer}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        let infraTypeData: Array<Tree> = [];
        const infraTypes = await InfraType.all()
        infraTypeData = buildStructureForTree(infraTypes)
        const infraTypeTree = buildTree(infraTypeData)
        return inertia.render('infra_types/create', {
            infraTypeTree: infraTypeTree
        })
    }

    async attrs({response, bouncer, params}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('view')) {
            return response.json({error: 'Access denied'})
        }
        const {id} = params
        if (!id) {
            return response.json({error: 'Id not found'})
        }
        const infraType = await InfraType.find(id)
        if (!InfraType) {
            return response.json({error: 'Infra type not found'})
        }
        await infraType?.load('attrs')
        return response.json({attrs: infraType?.attrs})
    }

    async edit({inertia, bouncer, params, request}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('edit')) {
            return inertia.render('errors/access_denied', {})
        }
        let infraTypeData: Array<Tree> = [];
        const infraTypes = await InfraType.all()
        infraTypeData = buildStructureForTree(infraTypes)
        const infraTypeTree = buildTree(infraTypeData)

        const {id} = params
        const infraType = await InfraType.find(id)

        if (!infraType) {
            return inertia.render('errors/not_found', {
                backUrl: request.header('referer')
            })
        }

        await infraType?.load('attrs')
        await infraType?.load('attachments')
        await infraType?.attachments.forEach(async (attachment) => {
            attachment.url = await attachment.attachment.getUrl()
        })

        return inertia.render('infra_types/edit', {
            infraTypeTree: infraTypeTree,
            infraTypeData: infraType
        })
    }

    async store({inertia, bouncer, request, response}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        const data = request.except(['errors', 'attachments'])
        
        // validate
        await storeInfraTypeValidator.validate(data)

        // create infra type
        const infraType = await InfraType.create(data)

        // tạo attrs
        if (data.hasOwnProperty('attrs') && Array.isArray(data.attrs) && data.attrs.length) {
            for (let attr of data.attrs) {
                console.log(attr)
                console.log(JSON.stringify(attr.options))
                const attrModel = await Attr.create({
                    name: attr.name,
                    type: attr.type,
                    options: attr.options
                })
               await infraType.related('attrs').attach({
                    [attrModel.id]: {
                        options: attr.options,
                    },
                })
            }
        }

        // tao files
        const attachments = request.files('attachments')
        for (let document of attachments) {
            const systemFile = new SystemFile()
            systemFile.attachment = await attachmentManager.createFromFile(document)
            systemFile.refType = InfraType.name
            // systemFile.refCode = infraType.code
            // await systemFile.save()
            await infraType.related('attachments').save(systemFile)
        }
        
        return response.redirect('/infra-types')
    }

    async update({inertia, bouncer, request, response, params}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        const data = request.except(['errors', 'attachments'])
        // validate
        await storeInfraTypeValidator.validate(data)

        const {id} = params
        // create infra type
        const infraType = await InfraType.find(id)
        if (infraType) {
            infraType.name = data.name
            infraType.description = data.description
            infraType.parentId = data.parentId
            await infraType.save()
            // tạo attrs
            if (data.hasOwnProperty('attrs') && Array.isArray(data.attrs) && data.attrs.length) {
                for (let attr of data.attrs) {
                    console.log(JSON.stringify(attr.options))
                    let attrModel = new Attr()
                    if (attr.id) {
                        attrModel = await Attr.findOrFail(attr.id)
                        await infraType.related('attrs').detach([attrModel.id])
                        await attrModel.merge({
                            name: attr.name,
                            type: attr.type,
                            code: attr.code,
                            options: attr.options
                        }).save()
                    } else {
                        attrModel = await Attr.create({
                            name: attr.name,
                            type: attr.type,
                            code: attr.code,
                            options: attr.options
                        })
                    }
                    await infraType.related('attrs').attach({
                        [attrModel.id]: {
                            options: attr.options,
                        },
                    })
                }
            }

            // tao files
            const attachments = request.files('attachments')
            for (let document of attachments) {
                const systemFile = new SystemFile()
                systemFile.attachment = await attachmentManager.createFromFile(document)
                systemFile.refType = InfraType.name
                // systemFile.refCode = infraType.code
                // await systemFile.save()
                await infraType.related('attachments').save(systemFile)
            }
        }
        
        return response.redirect('/infra-types')
    }

    async destroy({inertia, bouncer, params, response}: HttpContext) {
        if (await bouncer.with(InfraTypePolicy).denies('delete')) {
            return inertia.render('errors/access_denied', {})
        }
        const {id} = params
        if (id) {
            const infraType = await InfraType.find(id)
            if (infraType) {
                // console.log(infraType.name)
                try {
                    infraType.related('attrs').detach()
                    infraType.delete()
                } catch (exx) {
                    console.log(exx)
                }
            }
        }
        return response.redirect().back()
    }
}