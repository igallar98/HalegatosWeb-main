# Club Halegatos

Sitio estatico en Jekyll preparado para publicarse en GitHub Pages.

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

1. Crea un repositorio en GitHub y sube este proyecto.
2. Asegurate de que el repositorio se llame `HalegatosWeb` si quieres mantener el `baseurl` actual de [`_config.yml`](./_config.yml).
3. Haz push a la rama `main`.
4. En GitHub, ve a `Settings > Pages` y selecciona `GitHub Actions` como fuente.
5. El workflow [`pages.yml`](./.github/workflows/pages.yml) construira y desplegara el sitio automaticamente.

## Desarrollo local

1. Instala Ruby y Bundler.
2. Ejecuta `bundle install`.
3. Arranca el servidor con `bundle exec jekyll serve`.

## Git recomendado

- El `.gitignore` ya excluye caches, dependencias locales de Ruby, logs y la carpeta compilada `_site/`.
- `Gemfile.lock` se mantiene versionado para que el entorno sea reproducible.
