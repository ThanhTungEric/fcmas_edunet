/*
|--------------------------------------------------------------------------
| Bouncer policies
|--------------------------------------------------------------------------
|
| You may define a collection of policies inside this file and pre-register
| them when creating a new bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

export const policies = {
  BasePolicy: () => import('#policies/base_policy'),
  DashboardPolicy: () => import('#policies/dashboard_policy'),
  InfraPolicy: () => import('#policies/infra_policy'),
  InfraTypePolicy: () => import('#policies/infra_type_policy')
}
