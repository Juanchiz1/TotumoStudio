// Fuente única de los tipos de proyecto. La usan el hero, los servicios y el cotizador.
export const projectTypes = [
  {
    id: 'landing',
    name: 'Landing page',
    shortName: 'Landing',
    description: 'Una sola página para vender un producto o captar contactos.',
    url: 'tu-negocio.co/promo',
    basePrice: 1500000,
    weeks: 2,
  },
  {
    id: 'sitio',
    name: 'Sitio corporativo',
    shortName: 'Sitio',
    description: 'Varias páginas: quiénes son, servicios y contacto.',
    url: 'tu-negocio.co',
    basePrice: 3200000,
    weeks: 4,
  },
  {
    id: 'tienda',
    name: 'Tienda online',
    shortName: 'Tienda',
    description: 'Catálogo, carrito y pedidos desde el celular.',
    url: 'tu-negocio.co/tienda',
    basePrice: 5500000,
    weeks: 6,
  },
  {
    id: 'app',
    name: 'App web a medida',
    shortName: 'App',
    description: 'Un sistema propio: citas, inventario o reservas.',
    url: 'app.tu-negocio.co',
    basePrice: 9000000,
    weeks: 10,
  },
]