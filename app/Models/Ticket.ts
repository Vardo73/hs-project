import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email:string

  @column()
  public country:string

  @column()
  public tracking_number:string

  @column()
  public carrier:string

  @column()
  public incident_type:string

  @column()
  public description:string

  @column()
  public update_hs:boolean


 /////////////
  @column()
  public street:string
  
  @column()
  public zipcode:string

  @column()
  public city:string

  @column()
  public neighbourhood:string

  @column()
  public state:string

  //////////////
  @column()
  public claim:string

  @column()
  public coverage:string

  @column()
  public packaging:string

  @column()
  public description_alt:string

  @column()
  public description_cont:string

  @column()
  public description_rep:string

  ///////////////

  @column()
  public description_dest:string

  @column()
  public references:string


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
