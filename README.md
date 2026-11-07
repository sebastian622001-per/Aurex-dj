# AUREX DJ v0.3

PWA de preparación DJ para uso personal. Conserva la integración Spotify OAuth PKCE y las playlists existentes.

## Cambios
- Editor por canción para BPM, tonalidad Camelot y marcadores de estructura y mezcla.
- Los marcadores se introducen manualmente después de verificarlos en rekordbox.
- Transiciones de 8 compases calculadas únicamente cuando existe BPM, sin inventar posiciones de CUE.
- Exportación JSON v0.3; guardado local en la misma clave de v0.2.
- Cache de service worker actualizada.

## Publicación
Subir el contenido de esta carpeta a la raíz del repositorio GitHub Pages. Mantener exactamente el nombre `index.html`. No publicar contraseñas ni secretos de Spotify. El Client ID es público por diseño.

## Precauciones
La app no extrae audio de Spotify/rekordbox, no escribe CUE en rekordbox y no ha sido probada aquí contra un navegador iOS real. Haz una copia del JSON exportado antes de sustituir archivos. El análisis de audio local sigue siendo estimativo.
