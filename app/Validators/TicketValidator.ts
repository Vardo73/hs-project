import { schema, CustomMessages,rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TicketValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email:schema.string({},[
      rules.email()
    ]),
    country:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    trackinNumber:schema.string({},[
      rules.minLength(4),
      rules.maxLength(30)
    ]),
    carrier:schema.string({},[
        rules.minLength(4),
        rules.maxLength(25)
    ]),
    incident:schema.string({},[
      rules.minLength(4),
      rules.maxLength(25)
    ]),
    description:schema.string({},[
        rules.minLength(4),
        rules.maxLength(128)
    ]),


    street:schema.string.optional(),
    zipcode:schema.string.optional(),
    city:schema.string.optional(),
    neighbourhood:schema.string.optional(),
    state:schema.string.optional(),

    cobertura:schema.enum([
        'Si', 
        'No'
    ]),
    embalaje:schema.enum([
        'Si', 
        'No'
    ]),
    descripcionAlteraciones:schema.string.optional(),
    descriptionContent:schema.string.optional(),
    costoReposicion:schema.string.optional(),

    addressDestination:schema.string.optional(),
    referens:schema.string.optional()
  })
  public messages: CustomMessages = {
    required:'El campo {{field}} es requerido para registrar el contaminante.',
    minLength:'Campo {{field}} muy corto.(min {{options.minLength}} caracteres)',
    maxLength:'Campo {{field}} muy largo.(max {{options.maxLength}} caracteres)',
    email:'Campo {{field}} no cuenta con el formato correcto de correo electrónico',
    unique:'Ya se encuentra registrado un elemento con el mismo valor para {{field}}'
  }
}