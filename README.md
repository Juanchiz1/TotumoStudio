# Totumo Studio

Sitio web de un estudio de desarrollo web a medida. El visitante puede ver una demo interactiva según el tipo de proyecto que le interesa, armar un presupuesto en el cotizador y enviar la solicitud desde el formulario de contacto con el resumen ya escrito.

## Secciones

- **Inicio**: demo que cambia según el tipo de proyecto (landing page, sitio corporativo, tienda online o app web).
- **Servicios** y **Proyectos**: trabajos de ejemplo con imágenes responsive en WebP.
- **Cotizador**: se elige tipo de proyecto, alcance (esencial, completo o avanzado), extras y si es urgente. Muestra un rango de precio en pesos colombianos y las semanas estimadas. La selección queda guardada en `localStorage`.
- **Proceso** y **Contacto**: el formulario valida los campos en el navegador y envía el mensaje con Web3Forms. Si se viene del cotizador, el mensaje se precarga con el presupuesto.

## Stack

- HTML, JavaScript con módulos ES (sin framework)
- Sass con estructura por capas (`abstracts`, `base`, `layout`, `components`)
- Vite
- Vitest

## Cómo está organizado el JavaScript

La lógica que se puede probar está separada del DOM:

```
src/js/
├── quote/
│   ├── pricing.js    cálculo del presupuesto (función pura)
│   ├── message.js    texto que se precarga en el formulario
│   ├── store.js      estado del cotizador y persistencia en localStorage
│   └── quote.js      conexión con la interfaz
├── contact/
│   ├── validate.js   validación del formulario
│   ├── send.js       envío a Web3Forms
│   └── contact.js    conexión con la interfaz
├── data/             tipos de proyecto, precios y extras
└── utils/            formato de moneda y números
```

Los precios viven en `src/js/data/`, así que cambiar una tarifa no toca la lógica.

## Correr en local

Requisitos: Node.js 20.19+ o 22.12+ (lo pide Vite 8).

```bash
npm ci
npm run dev
```

Para que el formulario envíe mensajes, crea un archivo `.env.local` con tu llave de [Web3Forms](https://web3forms.com):

```
VITE_WEB3FORMS_KEY=tu_llave
```

Sin la llave, el formulario valida igual, pero al enviar muestra un aviso de que no está configurado.

Build de producción:

```bash
npm run build
```

## Tests

```bash
npm run test:run
```

25 tests en 6 archivos: cálculo de precios, mensaje del cotizador, store, validación y envío del formulario, y formato de moneda.

## Autor

**Juan Diego Negrete Portillo**
Estudiante de Ingeniería de Sistemas — Universidad de Córdoba
[Portafolio](https://juanchiz1.github.io/Portafolio-Juan_Diego_Negrete/) · [LinkedIn](https://www.linkedin.com/in/juan-diego-negrete-portillo-352111195/) · [GitHub](https://github.com/Juanchiz1)
