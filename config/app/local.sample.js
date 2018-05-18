import common from './common';

export default {
  ...common,
  env: 'local',
  cookiesRoot: 'localhost',
  storefrontURL: '//0.0.0.0:3030/',
  monsterURL: '//www.templatemonsterdev.com/',
  authURL: '//localhost:3000/',
  cabinetURL: '//localhost:8099/',
  authServiceURL: '//api.templatemonsterdev.com/oauth/',
  balancesServiceURL: '//api.templatemonsterdev.com/balances/v2/',
  cartsServiceURL: '//api.templatemonsterdev.com/carts/v1/',
  centrifugeCartURL: '//centrifugo.templatemonsterdev.com/',
  centrifugeNotificationsURL: '//dockerdev.templatemonster.com:8012',
  chatURL: '//chat.template-help.dev/',
  collectionsServiceURL: '//api.templatemonsterdev.com/collection/v2/',
  localesServiceURL: '//service-locales.templatemonsterdev.com/api/v1/locales',
  membershipsServiceURL: 'https://api.templatemonsterdev.com/memberships/v1/',
  navigationsServiceURL: '//api.templatemonsterdev.com/navigations/v1/',
  ordersServiceURL: '//api.templatemonsterdev.com/orders/v1/',
  productsServiceURL: '//api.templatemonsterdev.com/products/v2/',
  reviewsServiceURL: '//api.templatemonsterdev.com/reviews/v1/',
  servicesServiceURL: '//api.templatemonsterdev.com/services/v1/',
  ticketsServiceURL: '//api.templatemonsterdev.com/tickets/v1/',
  uploadsServiceURL: '//api.templatemonsterdev.com/uploads/v1/',
  usersServiceURL: '//api.templatemonsterdev.com/users/v1/',
  vendorsServiceURL: '//api.templatemonsterdev.com/authors/v1/',
  notificationsServiceURL: '//api.templatemonsterdev.com/notifications/v1/',
};
