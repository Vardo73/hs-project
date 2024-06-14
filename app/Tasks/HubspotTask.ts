import { BaseTask } from 'adonis5-scheduler/build/src/Scheduler/Task'
import HubspotService from 'App/Services/HubspotService';
import Ticket from 'App/Models/Ticket';

export default class HubspotTask extends BaseTask {
  public static get schedule() {
		return '0 */30 * * * *'
  }
  public static get useLock() {
    return false
  }

  public async handle() {
    try {
      const hubspotService = await new HubspotService(); 
      const tickets = await Ticket.query().where('update_hs', false)

      if (tickets.length === 0) {
        console.log('No tickets found with update_hs = false. Exiting...');
        return; 
      }

      await Promise.allSettled(
        tickets.map(async ticket => {
          try {
            const contact = await hubspotService.getContact(ticket.email);
            const success = await hubspotService.create_ticket(ticket, contact);
    
            if (success) {
              console.log(`Ticket  ${ticket.id} - ${ticket.email} created successfully`);
            } else {
              console.log(`Failed to create ticket ${ticket.id} - ${ticket.email}`);
            }
          } catch (error) {
            console.error(`Error creating ticket ${ticket.id} - ${ticket.email}:`, error);
          }
        })
      );

    } catch (error) {
      console.log(error,'HubspotTask.ts')
    }
  }
}
