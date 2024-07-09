import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ticket from 'App/Models/Ticket'
import HubspotService from 'App/Services/HubspotService'
//import TicketValidator from 'App/Validators/TicketValidator'


export default class MainsController {

  //Manda a formulario de creación de reporte
  public async show({view}:HttpContextContract){
    return view.render('public/form_report')
  }

  //Creación del reporte
  public async create_report({ request, view } : HttpContextContract) {

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

  //Recibe el momentario del usuario 
  public async comment_csat({ request, view } : HttpContextContract) {
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

  //Recibe calificación CSAT por Correo, regresa pagina de comentario
  public async csat_sentiment({ params, view,request} : HttpContextContract){
    const hubspotService = new HubspotService();
    const clientIp = request.ip()
    const userAgent = request.header('User-Agent')
    const referer = request.header('Referer')
    const geoInfo = await hubspotService.getGeoInfo(clientIp)

    const info_browser=`IP: ${clientIp}, User-Agent: ${userAgent}, Referer: ${referer}, GeoInfo: ${JSON.stringify(geoInfo)} `

    const { id_ticket, csat_sentiment: sentiment } = params;
    
    if (!id_ticket || !sentiment) {
      console.error('id_ticket or sentiment is missing');
      return { message: 'Invalid parameters' };
    }
    
    try {

      await hubspotService.csat_sentiment(id_ticket, sentiment,info_browser);
      return view.render('public/comment_csat',{id_ticket});
    } catch (error) {
      console.error(`Error adding sentiment to ticket ${id_ticket}:`, error);
      return  { message: 'Failed to update sentiment' };
    }
  }

  //Muestra formualario completo de CSAT Propio
  public async show_wsp_csat_sentiment({ params , view} : HttpContextContract ){

    const { id_ticket} = params;

    return view.render('public/form_csat',{id_ticket})
  }

  //Recibe info formulario CSAT propio 
  public async wsp_csat({request,view}: HttpContextContract){

    const hubspotService = new HubspotService();
    const clientIp = request.ip()
    const userAgent = request.header('User-Agent')
    const referer = request.header('Referer')
    const geoInfo = await hubspotService.getGeoInfo(clientIp)

    const info_browser=`IP: ${clientIp}, User-Agent: ${userAgent}, Referer: ${referer}, GeoInfo: ${JSON.stringify(geoInfo)} `

    const { id_ticket,csat_sentiment, comments } = request.body();

    if (!id_ticket || !csat_sentiment) {
      console.error('id_ticket or sentiment is missing');
      return { message: 'Invalid parameters' };
    }

    try {
      await hubspotService.csat_sentiment(id_ticket, csat_sentiment,info_browser,comments);
      
    } catch (error) {
      console.error(`Error adding comment to ticket ${id_ticket}:`, error);
    }

    return view.render('public/comment_success');
  }
}
