import fetch from 'node-fetch';
import Env from '@ioc:Adonis/Core/Env'
import { Contact } from 'App/Interfaces/HubspotInterface'; 
import Ticket from 'App/Models/Ticket';

const URL_BASE="https://api.hubapi.com/"

export default class HubspotService{

    public async csat_sentiment(id_ticket:string,csat_sentiment:string): Promise<boolean>{

        let url=`${URL_BASE}crm/v3/objects/tickets/${id_ticket}`
        const fecha_de_respuesta_csat= this.getCurrentDate()
        
        const headers = {
            'Authorization':  Env.get('API_KEY_HUBSPOT'),
            'Content-Type': 'application/json'
        };
        
        const body = JSON.stringify({
            properties: {
              csat_sentiment: csat_sentiment,
              fecha_de_respuesta_csat: fecha_de_respuesta_csat
            }
        });

        try {
            const response = await fetch(url, {
              method: 'PATCH',
              headers: headers,
              body: body
            });
        
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
        
            const data = await response.json();
            console.log('Success:', data);
            return true
        } catch (error) {
            console.error('Error:', error);
            return false
        }
    }

    private getCurrentDate(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
        const day = String(now.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }

    public async create_ticket(ticket:Ticket,id_contact:string | boolean): Promise<boolean>{
        
        const url = 'https://api.hubapi.com/crm/v3/objects/tickets';

        const body: any = {
            properties: {
              subject: 'Reporte de servicio',
              hs_pipeline_stage: '45494642',
              hs_pipeline: '18169513',
              pais_region: ticket.country,
              correo: ticket.email,
              paqueteria: ticket.carrier,
              tracking_number: ticket.tracking_number,
              tipo_de_incidencia: ticket.incident_type,
              content: ticket.description
            }
        };

        //valida si se obtuvo un contacto a asociar
        if (typeof id_contact === 'string') {
            body.associations = [
              {
                types: [
                  {
                    associationCategory: 'HUBSPOT_DEFINED',//Define que es un objeto nativo de HS
                    associationTypeId: 16 //Las relaciones Ticket a Contacto se maneja con el tipo #16
                  }
                ],
                to: {
                  id: id_contact
                }
              }
            ];
        }

        //Valida los campos extra
        switch (ticket.incident_type) {
            case 'Confirmación de entrega':
                Object.assign(body.properties, {
                    calle: ticket.street,
                    codigo_postal__destinatario_: ticket.zipcode,
                    ciudad: ticket.city,
                    colonia__destino_: ticket.neighbourhood,
                    estado_provincia_destino: ticket.state
                })
            break
          
            case 'Indemnización':
                Object.assign(body.properties, {
                    reclamacion__indemnizaciones__2024_bueno:ticket.claim,
                    su_envio_contaba_con_cobertura_adicional_: ticket.coverage,
                    el_empaque_exterior_presenta_alteraciones_: ticket.packaging,
                    la_caja_presenta_alteracion__favor_de_describir_detalladamente_: ticket.description_alt,
                    describe_el_contenido_y_la_cantidad_de_piezas_faltantes: ticket.description_cont,
                    cual_es_el_costo_de_reposicion_total_del_articulo_s__: ticket.description_rep
                })
            break
          
            case 'Recolección Incumplida':
                Object.assign(body.properties, {
                    origin_address: ticket.description_dest,
                    referencias_del_domicilio: ticket.references
                })
            break
          
            default:
              break
        }

        const options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': Env.get('API_KEY_HUBSPOT')
            },
            body: JSON.stringify(body)
        };

        try {
          const response = await fetch(url, options);
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
      
          return true
        } catch (error) {
          console.error('Error creating ticket:', error);
          return false
        }
    }

    public async getContact(email):Promise<string | boolean>{

        const url = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;

        const options = {
          method: 'GET',
          headers: {
            'Authorization':Env.get('API_KEY_HUBSPOT')
          },
        };

        try {
            const response = await fetch(url, options);

            if (response.status === 404) {
                return false
            }

            if (!response.ok) {
              throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data:Contact = await response.json();
            return data.id
        } catch (error) {
            console.error('Error fetching contact:', error);
            return false
        }
    }


    public async comment_csat(id_ticket:string,comment:string): Promise<boolean>{

      let url=`${URL_BASE}crm/v3/objects/tickets/${id_ticket}`
      
      const headers = {
          'Authorization':  Env.get('API_KEY_HUBSPOT'),
          'Content-Type': 'application/json'
      };
      
      const body = JSON.stringify({
          properties: {
            respuestas_csat: comment,
          }
      });

      try {
          const response = await fetch(url, {
            method: 'PATCH',
            headers: headers,
            body: body
          });
      
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
      
          const data = await response.json();
          console.log('Success:', data);
          return true
      } catch (error) {
          console.error('Error:', error);
          return false
      }
  }
}