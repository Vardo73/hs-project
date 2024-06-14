import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email',50).notNullable()
      table.string('country',25).notNullable()
      table.string('tracking_number',30).notNullable()
      table.string('carrier',25).notNullable()
      table.string('incident_type',25).notNullable()
      table.string('description',128).notNullable()
      table.boolean('update_hs')


      table.string('street',128)
      table.string('zipcode',10)
      table.string('city',128)
      table.string('neighbourhood',128)
      table.string('state',128)

      table.string('claim',25)
      table.string('coverage',25)
      table.string('packaging',25)
      table.string('description_alt',128)
      table.string('description_cont',128)
      table.string('description_rep',128)

      table.string('description_dest',128)
      table.string('references',50)


      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
