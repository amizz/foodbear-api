import { allRestaurant, allRestaurantSchema } from '#controllers/restaurant/all-restaurants';
import { searchRestaurant, searchRestaurantSchema } from '#controllers/restaurant/search-restaurant';
import { topRestaurant, topRestaurantSchema } from '#controllers/restaurant/top-restaurant';
import { Ctx, Done, Fastify, Req, Res, RouteOptions } from '../interfaces/fastify'

export const restaurantRoute = (route: Fastify, options: RouteOptions, done: Done): any => {

  route.get('/restaurants', {...allRestaurantSchema}, allRestaurant);
  route.get('/restaurants/search', {...searchRestaurantSchema}, searchRestaurant);
  route.get('/restaurants/top', {...topRestaurantSchema},topRestaurant);

  done()
}
