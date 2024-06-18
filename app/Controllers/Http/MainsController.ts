import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ticket from 'App/Models/Ticket'
import HubspotService from 'App/Services/HubspotService'
//import TicketValidator from 'App/Validators/TicketValidator'


export default class MainsController {

  public async show({view}:HttpContextContract){
      return view.render('public/form_report')
  }

  public async create_report({ request, view }: HttpContextContract) {

    //await request.validate(TicketValidator)
        
    const {
      email,
      country,
      trackinNumber,
      carrier,
      incident,
      description,
      street,
      zipcode,
      city,
      neighbourhood,
      state,
      reclamo,
      cobertura,
      embalaje,
      descripcionAlteraciones,
      descriptionContent,
      costoReposicion,
      referens,
      addressDestination,
    } = request.body()
    
    // Objeto base con campos comunes
    const baseData = {
      email: email,
      country: country,
      tracking_number: trackinNumber,
      carrier: carrier,
      incident_type: incident,
      description: description,
      update_hs:false
    }
    
    // Agregar campos específicos según el tipo de incidente
    let ticketData = { ...baseData }
    
    switch (incident) {
      case 'Confirmación de entrega':
        Object.assign(ticketData, {
          street: street,
          zipcode: zipcode,
          city: city,
          neighbourhood: neighbourhood,
          state: state,
        })
        break
    
      case 'Indemnización':
        Object.assign(ticketData, {
          claim:reclamo,
          coverage: cobertura,
          packaging: embalaje,
          description_alt: descripcionAlteraciones,
          description_cont: descriptionContent,
          description_rep: costoReposicion,
        })
        break
    
      case 'Recolección Incumplida':
        Object.assign(ticketData, {
          description_dest: addressDestination,
          references: referens,
        })
        break
    
      default:
        break
    }
    
    await Ticket.create(ticketData)

    return view.render('public/report_success')
  }


  public async comment_csat({ request, view }: HttpContextContract) {
    const hubspotService = new HubspotService();
    const { id_ticket, comments } = request.body();


    if (!comments || comments.trim() === '') {
      return view.render('public/comment_success');
    }

    try {
      await hubspotService.comment_csat(id_ticket, comments);
      
    } catch (error) {
      console.error(`Error adding comment to ticket ${id_ticket}:`, error);
    }

    return view.render('public/comment_success');
  }

  public async csat_sentiment({ params, view}: HttpContextContract){
    const hubspotService = new HubspotService();
    const { id_ticket, csat_sentiment: sentiment } = params;
    
    if (!id_ticket || !sentiment) {
      console.error('id_ticket or sentiment is missing');
      return { message: 'Invalid parameters' };
    }
    
    try {

      await hubspotService.csat_sentiment(id_ticket, sentiment);
      return view.render('public/comment_csat',{id_ticket});
    } catch (error) {
      console.error(`Error adding sentiment to ticket ${id_ticket}:`, error);
      return  { message: 'Failed to update sentiment' };
    }
  }
}
