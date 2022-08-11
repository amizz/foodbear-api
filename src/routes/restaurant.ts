import { allRestaurant } from '#controllers/restaurant/all-restaurants';
import { searchRestaurant, searchRestaurantSchema } from '#controllers/restaurant/search-restaurant';
import { topRestaurant } from '#controllers/restaurant/top-restaurant';
import { Ctx, Done, Fastify, Req, Res, RouteOptions } from '../interfaces/fastify'

export const restaurantRoute = (route: Fastify, options: RouteOptions, done: Done): any => {

  route.get('/restaurants', allRestaurant);
  route.get('/restaurants/search', searchRestaurant);
  route.get('/restaurants/top', topRestaurant);

  done()
}
