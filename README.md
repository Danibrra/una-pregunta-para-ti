# Una pregunta para ti

Página romántica en español con gatitos, un marco de listones y una carta final. Hecha con HTML, CSS y JavaScript, sin instalación ni proceso de compilación.

## Cómo funciona

La bienvenida pregunta si quieres ver la sorpresa. Al elegir «Sí», aparece «¿Puedo ser tu novio?». Cada botón «No» muestra una respuesta con un gatito y permite volver. Aceptar la pregunta muestra dos gatitos, corazones animados y el botón para abrir la carta.

El botón «Personalizar» permite cambiar el destinatario, la pregunta, la carta y la firma. Los cambios se guardan únicamente en el navegador donde se realizan. Para que todos los visitantes vean una personalización, hay que actualizar los valores de `DEFAULTS` en `app.js` y subir ese cambio al repositorio.

## Publicar con GitHub Pages

En Settings → Pages del repositorio, elegir «Deploy from a branch», la rama `main` y la carpeta `/ (root)`. Guardar la configuración.

Los archivos ya están colocados para esa configuración. `.nojekyll` permite servirlos directamente como página estática.

## Archivos

- `index.html`: estructura de la página y formulario para personalizarla.
- `styles.css`: diseño adaptable, fuentes y animaciones.
- `app.js`: botones, carta y almacenamiento local.
- `assets/`: imágenes y fuentes locales.

## Probar en una computadora

Abrir `index.html` en un navegador. También se puede ejecutar `python -m http.server 8000` en esta carpeta y visitar `http://localhost:8000`.

La página no necesita claves de API ni servicios externos. Las animaciones respetan la preferencia del sistema para reducir movimiento.
