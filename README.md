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
2. Haz push a la rama `main`.
3. En GitHub, ve a `Settings > Pages` y selecciona `GitHub Actions` como fuente.
4. El workflow [`pages.yml`](./.github/workflows/pages.yml) construira y desplegara el sitio automaticamente.
5. No hace falta fijar el nombre del repositorio en [`_config.yml`](./_config.yml): el workflow inyecta el `baseurl` correcto para que funcione tanto en `https://usuario.github.io/repositorio/` como en un dominio propio.

## Desarrollo local

1. Instala Ruby y Bundler.
2. Ejecuta `bundle install`.
3. Arranca el servidor con `bundle exec jekyll serve`.
4. Si mas adelante publicas en `www.halegatos.com`, solo tendras que configurar el dominio en GitHub Pages y el DNS; las rutas internas del sitio seguiran funcionando.

## Git recomendado

- El `.gitignore` ya excluye caches, dependencias locales de Ruby, logs y la carpeta compilada `_site/`.
- `Gemfile.lock` se mantiene versionado para que el entorno sea reproducible.
