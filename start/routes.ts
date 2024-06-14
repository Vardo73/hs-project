import Route from '@ioc:Adonis/Core/Route'

//View
//Public
Route.get('/','MainsController.show')
Route.get('csat_sentiment/:id_ticket/:csat_sentiment','MainsController.csat_sentiment')


Route.post('create_report','MainsController.create_report').as('create_report')
Route.post('comment_csat','MainsController.comment_csat').as('comment_csat')