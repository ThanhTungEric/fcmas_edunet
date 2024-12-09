import Attr from '#models/attr'
import Infra from '#models/infra'
import InfraType from '#models/infra_type'
import InfraTypeVersion from '#models/version'
import type { HttpContext } from '@adonisjs/core/http'

export default class InfraApi {
    async store({request, response}: HttpContext) {
        const data = request.all()
    
        const {infra_type, parent_uuid, uuid, name, attrs, code, infras = [], versions = []} = data

        if (Array.isArray(infras) && infras.length) {
            let resp = await Infra.updateOrCreateMany('uuid', infras)
            return response.json({
                result: resp
            })
        }
        if (Array.isArray(versions) && versions.length) {
            let resp = await InfraTypeVersion.updateOrCreateMany('uuid', versions)
            return response.json({
                result: resp
            })
        }
        if (infra_type) {
            const infraType = await InfraType.findBy('code', infra_type)
            if (infraType) {
                let parentInfraId = 0
                if (parent_uuid) {
                    const parentInfra = await Infra.findBy('uuid', parent_uuid)
                    if (parentInfra) {
                        parentInfraId = parentInfra.id
                    }
                }
                let infra = await Infra.findBy('uuid', uuid)
                if (!infra) {
                    let infraData = {
                        name: name,
                        uuid: uuid,
                        typeId: infraType.id,
                        parentId: parentInfraId,
                        code: code
                    }
                    infra = await Infra.create(infraData)
                }
                if (infra) {
                    // tạo attrs
                    if (attrs && Array.isArray(attrs) && attrs.length) {
                        for (let attr of attrs) {
                            console.log(attr)
                            console.log(JSON.stringify(attr.options))
                            let attrModel = null
                            if (attr.code) {
                                attrModel = await Attr.findBy('code', attr.code)    
                            }
                            if (!attrModel) {
                                attrModel = await Attr.create({
                                    name: attr.name,
                                    type: attr.type,
                                    code: attr.code,
                                    options: attr.options
                                })
                            }

                            let hasExist = await InfraType.query().where('id', infraType.id).whereHas('attrs', (query) => {
                                query.where('attr_id', attrModel.id)
                            }).first()
                            if (!hasExist) {
                                await infraType.related('attrs').attach({
                                    [attrModel.id]: {
                                        options: attr.options,
                                    },
                                })
                            }

                            hasExist = await Infra.query().where('id', infraType.id).whereHas('attrs', (query) => {
                                query.where('attr_id', attrModel.id)
                            }).first()
                            if (!hasExist) {
                                await infra.related('attrs').attach({
                                    [attrModel.id]: {
                                        value: {
                                            data: null,
                                            options: attr.options
                                        },
                                    },
                                })
                            }
                        }
                    }
                    await infraType.load('attrs')
                    infraType.attrs.forEach(async (attr) => {
                        let hasExist = await Infra.query().where('id', infra.id).whereHas('attrs', (query) => {
                            query.where('attr_id', attr.id)
                        }).first()
                        if (!hasExist) {
                            await infra.related('attrs').attach({
                                [attr.id]: {
                                    value: {
                                        data: null,
                                        options: attr.options
                                    },
                                },
                            })
                        }
                    })
                }
            }
        }

        return response.json(data)
    }


    async infraTypes({request, response}: HttpContext) {
        const data = request.all()
        let infraTypes = await InfraType.query().select('id', 'name', 'code', 'uuid', 'description', 'options', 'parent_id').pojo()
        
        return response.json(infraTypes)
        return response.json({
            infraTypes: infraTypes
        })
    }
}