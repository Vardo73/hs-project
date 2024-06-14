// app/Middleware/RoleMiddleware.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AuthenticationException } from '@adonisjs/auth/build/standalone'


export default class RoleMiddleware {
  public async handle (
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    roles: string[]
  ) {
    const user = auth.user
    await user?.load('rol')

    if (!user) {
      throw new AuthenticationException(
        'Unauthorized access',
        'E_UNAUTHORIZED_ACCESS',
        auth.name,
        '/',
      )
    }

    // Verifica si el usuario tiene el rol adecuado
    const hasRole = roles.some(role => user.rol.name ==role)

    if (!hasRole) {
      throw new AuthenticationException(
        'Insufficient permissions',
        'E_INSUFFICIENT_PERMISSIONS',
        auth.name,
        '/',
      )
    }

    await next()
  }
}
