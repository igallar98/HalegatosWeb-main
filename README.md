# Club Halegatos

Sitio estatico preparado para desplegarse en GitHub Pages con Jekyll.

## Estructura

- `_layouts/` contiene el layout global.
- `_includes/` agrupa header, footer y el hero reutilizable.
- `_data/` centraliza navegacion y disciplinas.
- `assets/` contiene CSS y JavaScript.
- `static/images/` guarda las imagenes locales que deben publicarse tal cual.

## Mantenimiento

- Las rutas internas usan `relative_url` para funcionar correctamente con `baseurl`.
- El header y el footer se editan una sola vez desde `_includes/`.
- Las disciplinas se gestionan desde [`_data/disciplines.yml`](./_data/disciplines.yml).

## Despliegue

1. Sube el contenido al repositorio fuente.
2. Activa GitHub Pages con despliegue desde la rama principal.
3. Jekyll generara el sitio usando `_config.yml`.
