import Infra from '#models/infra'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class InitializeInfraMiddleware {
  async handle({inertia}: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */

    let infras = await Infra.query().select('id', 'uuid', 'code', 'name', 'parent_id', 'url').orderBy('parentId', 'asc').pojo()
    // console.log(infras)

    inertia.share({
      'sidebarData': infras
    })

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}