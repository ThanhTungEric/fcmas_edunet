import type { HttpContext } from '@adonisjs/core/http'
import InfraPolicy from '#policies/infra_type_policy'
import Infra from '#models/infra'
import { storeInfraValidator } from '#validators/infra'
import { attachmentManager } from '@jrmc/adonis-attachment'
import Attr from '#models/attr'
import InfraType from '#models/infra_type'
import SystemFile from '#models/system_file'
// var { Client } = require("@opensearch-project/opensearch");
import {Client} from "@opensearch-project/opensearch"
import InfraTypeVersion from '#models/version'

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

function buildStructureForTree(infras: InfraType[]): Array<Tree> {
    let infraData: Array<Tree> = [];
    infras.forEach(infra => {
        infraData.push({
            id: infra.id,
            parentId: infra.parentId,
            label: infra.name,
            children: []
        })
    })
    return infraData
}

export default class InfrasController {
    async index({inertia, bouncer, params}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        
        const {pageId = 1} = params
        console.log('pageId: ', pageId)
        const infras = await Infra.query().preload('type').where('parentId', 0).paginate(pageId, 50)
        const paginationJSON = infras.serialize({
            fields: ['name', 'id']
        })

        return inertia.render('infras/index', {
            paginationJSON: paginationJSON,
            can: {
                create: await bouncer.with(InfraPolicy).allows('create'),
                edit: await bouncer.with(InfraPolicy).allows('edit'),
            }
        })
    }

    async attrs({response, params}: HttpContext) {
        const {id} = params
        var client = new Client({
            node: "http://localhost:9200",
            // ssl: {
            //     // ca: fs.readFileSync(ca_certs_path),
            //     // You can turn off certificate verification (rejectUnauthorized: false) if you're using 
            //     // self-signed certificates with a hostname mismatch.
            //     // cert: fs.readFileSync(client_cert_path),
            //     // key: fs.readFileSync(client_key_path)
            // },
            auth: {
                username: 'admin',
                password: 'ABCDeFghe1'
            },
            ssl: {
                rejectUnauthorized: false
            }
        });

        var infra = await Infra.find(id)
        let attrs: any = []
        if (infra) {
            var responseOs = await client.search({
                index: "infra_all_logs",
                body: {
                    "query": { 
                        "bool": { 
                        "filter": [ 
                            { "match":  { "infra_uuid": infra?.uuid }}
                        ]
                        }
                    },
                    "size": 0,
                    "aggs": {
                        "unique_id": {
                        "terms": {
                            "field": "attr_code.keyword",
                            "size": 100
                        },
                        "aggs": {
                            "top_result": {
                            "top_hits": {
                                "size": 1,
                                "_source": ["infra_uuid", "attr_code", "updated_at", "attr_value", "attr_unit"],
                                "sort": {
                                "updated_at" : "desc"
                                }
                            }
                            }
                        }
                        }
                    }
                },
            });
            const {body = {}} = responseOs
            const {aggregations = {}} = body
            const {unique_id = {}} = aggregations
            const {buckets = []} = unique_id
            
            if (Array.isArray(buckets) && buckets.length) {
                for (let k in buckets) {
                    let bucket = buckets[k]
                    const {top_result = {}} = bucket
                    const {hits = {}} = top_result
                    let hitData = hits.hits ?? []
                    if (Array.isArray(hitData) && hitData.length) {
                        const firstData = hitData[0]
                        const {_source} = firstData
                        attrs.push(_source)
                    }
                }
            }
        }

        return response.json({attrs: attrs})
    }

    async diagrams({inertia, bouncer, params}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        
        const {id = 0, url = ''} = params
        const infra = await Infra.find(id)

        return inertia.render('infras/diagram', {
            infra: infra,
            url: url
        })
    }

    async detail({inertia, bouncer, params, request}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('view')) {
            return inertia.render('errors/access_denied', {})
        }
        
        const {id = 0, pageId = 1} = params

        const infra = await Infra.find(id)
        if (infra) {
            const infraType = await InfraType.find(infra.typeId)
            if (infraType) {
                const hasChild = await InfraType.findBy('parent_id', infraType.id)
                if (!hasChild) {
                    await infra.load('attrs')
            
                    let version = await InfraTypeVersion.find(infra.versionId)
                    // console.log('version?.attrs: ', version?.attrs)

                    return inertia.render('infras/edit', {
                        // infraTree: infraTree,
                        parentId: infra.parentId,
                        infraTypes: [infraType],
                        infraData: infra,
                        infraAttrs: version?.attrs,
                        infraReferer: request.header('referer'),
                        title: 'Thông tin ' + infra.name,
                        getOpenSearch: 1
                    })
                }
            }
        }


        const infras = await Infra.query().preload('type').where('parentId', id).paginate(pageId, 50)
        const paginationJSON = infras.serialize({
            fields: ['name', 'id']
        })

        return inertia.render('infras/detail', {
            paginationJSON: paginationJSON,
            parentId: id,
            grandParent: infra?.parentId,
            can: {
                create: await bouncer.with(InfraPolicy).allows('create'),
                edit: await bouncer.with(InfraPolicy).allows('edit'),
            }
        })
    }

    async create({inertia, bouncer, params, request}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }

        const {parentId = 0} = params

        let infraTypeId = 0
        if (parentId) {
            const parentInfra = await Infra.find(parentId)
            if (parentInfra) {
                infraTypeId = parentInfra.typeId
            }
        }

        // lay nhung infra type la con cua infraTypeId
        let infraTypes = await InfraType.query().select('id', 'name').where('parentId', infraTypeId).pojo()

        // let infraData: Array<Tree> = [];
        // const infras = await InfraType.all()
        // infraData = buildStructureForTree(infras)
        // const infraTypeTree = buildTree(infraData)
        return inertia.render('infras/create', {
            // infraTypeTree: infraTypeTree,
            parentId: parentId,
            infraTypes: infraTypes,
            infraReferer: request.header('referer')
        })
    }

    async edit({inertia, bouncer, params, request}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('edit')) {
            return inertia.render('errors/access_denied', {})
        }
        let infraData: Array<Tree> = [];
        const infras = await Infra.all()
        infraData = buildStructureForTree(infras)
        const infraTree = buildTree(infraData)

        const {id} = params
        const infra = await Infra.find(id)

        if (!infra) {
            return inertia.render('errors/not_found', {
                backUrl: request.header('referer')
            })
        }

        await infra?.load('attrs')
        await infra?.load('attachments')
        await infra?.attachments.forEach(async (attachment) => {
            attachment.url = await attachment.attachment.getUrl()
        })
        let infraTypes = await InfraType.query().select('id', 'name').where('id', infra.typeId).pojo()

        return inertia.render('infras/edit', {
            infraTree: infraTree,
            parentId: infra.parentId,
            infraTypes: infraTypes,
            infraData: infra,
            infraReferer: request.header('referer')
        })
    }

    async store({inertia, bouncer, request, response, session, auth}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        const data = request.except(['errors', 'attachments'])
        console.log(data)
        // validate
        await storeInfraValidator.validate(data)

        // validate value of attrs
        if (data.hasOwnProperty('attrs') && Array.isArray(data.attrs) && data.attrs.length) {
            type errorValueType = {
                [key: number]: string
            }
            let errorValues: errorValueType = {}
            for (let attr of data.attrs) {
                // console.log(attr)
                if (attr.options && attr.options.required) {
                    switch (attr.type) {
                        case 'file': {
                            const attrFiles = request.files(`value[${attr.id}]`)
                            if (!attrFiles || !attrFiles.length) {
                                errorValues[attr.id] = "Trường này là bắt buộc"
                            }
                            break
                        }
                        case 'select': {
                            if (!data.value || !data.value.hasOwnProperty(attr.id) || !data.value[attr.id] || (Array.isArray(data.value[attr.id]) && !data.value[attr.id].length)) {
                                errorValues[attr.id] = "Trường này là bắt buộc"
                            }
                            break
                        }
                        // case 'boolean': {
                        //     if (!data.value || !data.value.hasOwnProperty(attr.id)) {
                        //         errorValues[attr.id] = "Trường này là bắt buộc"
                        //     }
                        //     break
                        // }
                        case 'string':
                        case 'number':
                        case 'text': {
                            if (!data.value || !data.value.hasOwnProperty(attr.id) || !data.value[attr.id]) {
                                errorValues[attr.id] = "Trường này là bắt buộc"
                            }
                            break
                        }
                    }
                }
            }
            if (Object.keys(errorValues).length) {
                session.flash('errors', {
                    value: errorValues
                })
                return response.redirect().back()
            }
        }

        // create infra type
        const infra = await Infra.create({
            name: data.name,
            code: data.code,
            url: data.url,
            typeId: data.typeId,
            parentId: data.parentId,
        })

        // link attrs
        if (data.hasOwnProperty('attrs') && Array.isArray(data.attrs) && data.attrs.length) {
            for (let attr of data.attrs) {
                let dataValue = data.value[attr.id] ?? null
                if (attr.type === 'file') {
                    let fileValues = []
                    const attrFiles = request.files(`value[${attr.id}]`)
                    for (let document of attrFiles) {
                        const systemFile = new SystemFile()
                        systemFile.attachment = await attachmentManager.createFromFile(document)
                        systemFile.refType = `${Infra.name}_${Attr.name}`
                        systemFile.refUuid = `${infra.uuid}_${attr.id}`
                        await systemFile.save()
                        fileValues.push({
                            id: systemFile.id,
                            name: systemFile.attachment.name,
                            url: await systemFile.attachment.getUrl()
                        })
                        // await infra.related('attachments').save(systemFile)
                    }
                    dataValue = fileValues
                }
                await infra.related('attrs').attach({
                    [attr.id]: {
                        value: {
                            data: dataValue,
                            options: attr.options
                        },
                        updated_by: auth?.user?.id
                    },
                })
            }
        }

        // tao files
        const attachments = request.files('attachments')
        for (let document of attachments) {
            const systemFile = new SystemFile()
            systemFile.attachment = await attachmentManager.createFromFile(document)
            systemFile.refType = Infra.name
            await infra.related('attachments').save(systemFile)
        }

        const redirectLink = data.infraReferer ? data.infraReferer : '/infras'
        return response.redirect(redirectLink)
    }

    async update({inertia, bouncer, request, response, session, auth, params}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('create')) {
            return inertia.render('errors/access_denied', {})
        }
        const data = request.except(['errors', 'attachments'])
        // validate
        await storeInfraValidator.validate(data)

        const infraAttachedIds: Array<number> = []
        // validate value of attrs
        if (data.hasOwnProperty('attrs') && Array.isArray(data.attrs) && data.attrs.length) {
            type errorValueType = {
                [key: number]: string
            }
            let errorValues: errorValueType = {}
            for (let attr of data.attrs) {
                infraAttachedIds.push(attr.id)
                if (attr.options && attr.options.required) {
                    switch (attr.type) {
                        case 'file': {
                            const attrFiles = request.files(`value[${attr.id}]`)
                            if (!attrFiles || !attrFiles.length) {
                                if (!data.value || !data.value[attr.id] || !data.value[attr.id].length) {
                                    errorValues[attr.id] = "Trường này là bắt buộc"
                                }
                            }
                            break
                        }
                        case 'select': {
                            if (!data.value || !data.value.hasOwnProperty(attr.id) || !data.value[attr.id] || (Array.isArray(data.value[attr.id]) && !data.value[attr.id].length)) {
                                errorValues[attr.id] = "Trường này là bắt buộc"
                            }
                            break
                        }
                        // case 'boolean': {
                        //     if (!data.value || !data.value.hasOwnProperty(attr.id)) {
                        //         errorValues[attr.id] = "Trường này là bắt buộc"
                        //     }
                        //     break
                        // }
                        case 'string':
                        case 'number':
                        case 'text': {
                            if (!data.value || !data.value.hasOwnProperty(attr.id) || !data.value[attr.id]) {
                                errorValues[attr.id] = "Trường này là bắt buộc"
                            }
                            break
                        }
                    }
                }
            }
            if (Object.keys(errorValues).length) {
                session.flash('errors', {
                    value: errorValues
                })
                return response.redirect().back()
            }
        }

        // create infra type
        const { id } = params
        const infra = await Infra.find(id)
        if (!infra) {
            return inertia.render('errors/not_found')
        }
        await infra?.merge({
            name: data.name,
            code: data.code,
            url: data.url,
            typeId: data.typeId,
            // parentId: data.parentId,
        }).save()

        // link attrs
        if (data.hasOwnProperty('attrs') && Array.isArray(data.attrs) && data.attrs.length) {
            await infra.related('attrs').detach(infraAttachedIds)
            for (let attr of data.attrs) {
                let dataValue = data.value[attr.id] ?? null
                if (attr.type === 'file') {
                    let fileValues = []
                    const attrFiles = request.files(`value[${attr.id}]`)
                    for (let document of attrFiles) {
                        const systemFile = new SystemFile()
                        systemFile.attachment = await attachmentManager.createFromFile(document)
                        systemFile.refType = `${Infra.name}_${Attr.name}`
                        systemFile.refUuid = `${infra.uuid}_${attr.id}`
                        await systemFile.save()
                        fileValues.push({
                            id: systemFile.id,
                            name: systemFile.attachment.name,
                            url: await systemFile.attachment.getUrl()
                        })
                        // await infra.related('attachments').save(systemFile)
                    }
                    if (fileValues.length) {
                        dataValue = fileValues
                    }
                }
                await infra.related('attrs').attach({
                    [attr.id]: {
                        value: {
                            data: dataValue,
                            options: attr.options
                        },
                        updated_by: auth?.user?.id
                    },
                })
            }
        }

        // tao files
        const attachments = request.files('attachments')
        for (let document of attachments) {
            const systemFile = new SystemFile()
            systemFile.attachment = await attachmentManager.createFromFile(document)
            systemFile.refType = Infra.name
            await infra.related('attachments').save(systemFile)
        }

        const redirectLink = data.infraReferer ? data.infraReferer : '/infras'
        return response.redirect(redirectLink)
    }

    async destroy({inertia, bouncer, params, response}: HttpContext) {
        if (await bouncer.with(InfraPolicy).denies('delete')) {
            return inertia.render('errors/access_denied', {})
        }
        const {id} = params
        if (id) {
            const infra = await Infra.find(id)
            if (infra) {
                // console.log(infra.name)
                try {
                    infra.related('attrs').detach()
                    infra.delete()
                } catch (exx) {
                    console.log(exx)
                }
            }
        }
        return response.redirect().back()
    }
}