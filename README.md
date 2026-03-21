# Tuluka Fitness Club — Sitio web de gimnasio

Sitio web moderno y responsive para un gimnasio/fitness center, con HTML, CSS y JavaScript vanilla.

## Contenido

- **Inicio**: Hero con CTA, beneficios, testimonios y horarios destacados
- **Clases**: Musculación, spinning, yoga, crossfit, pilates, funcional (con imágenes)
- **Entrenadores**: Perfiles con foto, nombre, especialidad y bio
- **Planes y precios**: Mensual, trimestral (destacado), anual
- **Galería**: Instalaciones y equipamiento
- **Contacto**: Formulario con validación, mapa, teléfono, email, dirección y horario
- **Footer**: Redes sociales, enlaces rápidos y newsletter

## Publicar en GitHub Pages (gratis)

1. Subí el código al repo **GitHub** (rama `main`), por ejemplo: `https://github.com/Marcos324/tlk`
2. En GitHub: **Settings** → **Pages** (menú izquierdo)
3. En **Build and deployment** → **Source**: elige **Deploy from a branch**
4. **Branch**: `main` y carpeta **`/ (root)`** → **Save**
5. En 1–2 minutos el sitio quedará en:
   - **`https://TU-USUARIO.github.io/tlk/`**  
   (reemplazá `TU-USUARIO` por tu usuario de GitHub, ej. `Marcos324`)

**Notas:** El archivo `.nojekyll` evita que GitHub intente procesar el sitio con Jekyll. Si más adelante comprás un dominio propio, en **Pages** podés configurar **Custom domain** y (opcional) HTTPS.

---

## Cómo ver el sitio en local

1. Abre `index.html` en tu navegador (doble clic o arrastra el archivo).
2. O sirve la carpeta con un servidor local, por ejemplo:
   - **VS Code**: extensión "Live Server" y "Go Live".
   - **Node**: `npx serve .` en la raíz del proyecto.
   - **Python**: `python -m http.server 8000` y visita `http://localhost:8000`.

## Estructura del proyecto

```
TLK/
├── index.html      # Página principal (una sola página con secciones)
├── css/
│   └── style.css   # Estilos y responsive
├── js/
│   └── main.js     # Menú móvil, validación, animaciones
└── README.md
```

## Personalización

- **Nombre del gym**: El sitio usa la marca Tuluka Fitness Club; puedes ajustar textos en `index.html` si lo necesitas.
- **Contacto**: Edita teléfono, email, dirección y enlace del mapa en la sección Contacto y en el formulario (mailto).
- **Imágenes**: Las imágenes usan Unsplash. Para usar las tuyas, sustituye las URLs en los `style="background-image: url(...)"` o añade una carpeta `images/` y actualiza las rutas.
- **Colores**: En `css/style.css`, modifica las variables `:root` (por ejemplo `--accent: #e63946`).
- **Alias Mercado Pago** (cuota, tienda, carrito, `pago.html`): editá solo `js/config-pagos.js` → propiedad `alias` (y opcionalmente `mercadoPagoUrl` y `whatsapp`).

## Formulario de contacto

Por defecto, al enviar se abre el cliente de correo (mailto). Para enviar realmente desde la web necesitas un backend o un servicio (Formspree, Netlify Forms, etc.): sustituye el `mailto` en `js/main.js` por una petición a tu API o endpoint.

## Navegadores

Probado en Chrome, Firefox, Edge y Safari. Diseño responsive para móvil, tablet y desktop.
