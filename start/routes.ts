import Route from '@ioc:Adonis/Core/Route'

//REPORTES
Route.get('/','MainsController.show') //Formulario de reporte
Route.post('create_report','MainsController.create_report').as('create_report') //creación del reporte

//CSAT
Route.get('csat_sentiment/:id_ticket/:csat_sentiment','MainsController.csat_sentiment') //URL para CSAT por Correo
Route.get('wsp/csat/:id_ticket','MainsController.show_wsp_csat_sentiment')//URL para CSAT por Whatsapp

Route.post('comment_csat','MainsController.comment_csat').as('comment_csat') // Envio de comentarios
Route.post('wsp/csat','MainsController.wsp_csat').as('wsp_csat_sentiment')// Recibe info del formulario CSAT