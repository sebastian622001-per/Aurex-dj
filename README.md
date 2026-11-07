# AUREX DJ v0.1 — Prototipo PWA

## Incluye
- Biblioteca local de pistas, edición de orden y persistencia en localStorage.
- Importación voluntaria de audio local y estimación de BPM mediante autocorrelación de variaciones de energía.
- Entrada manual para pistas de streaming, sin extraer audio de servicios externos.
- Propuestas de CUE heurísticas, no basadas en detección real de frases o voces.
- Reglas iniciales por género y exportación JSON de la sesión.
- Service worker para uso offline después de la primera carga.

## Limitaciones
- No conecta con rekordbox iOS ni coloca CUE automáticamente.
- No analiza audio DRM/streaming de terceros ni escucha el audio de otra app.
- El BPM puede ser incorrecto o estar a mitad/doble tempo; los CUE son candidatos genéricos.
- El orden sugerido solo clasifica BPM; no evalúa tonalidad ni calidad musical.
- El audio se procesa en memoria, no se sube ni se guarda; los datos de pistas se guardan en el navegador.

## Probar
Servir esta carpeta por HTTPS para instalar en iPhone: Safari → Compartir → Añadir a pantalla de inicio. En un ordenador para pruebas locales: `python -m http.server 8000` y abrir http://localhost:8000. En iPhone, el modo PWA offline requiere origen HTTPS.


## Spotify OAuth PKCE (v0.2)
1. Aloja estos archivos en HTTPS (por ejemplo, GitHub Pages).
2. Abre la PWA publicada y copia la URL mostrada bajo Spotify.
3. Registra esa **Redirect URI exacta** en Spotify Developer Dashboard → AUREX DJ → Settings.
4. Pulsa «Conectar Spotify», autoriza el acceso y selecciona una playlist.
5. Importa metadatos. El acceso a endpoints depende de las restricciones de la app y la cuenta.

No usa Client Secret; el access token se mantiene solo en sessionStorage. No hay refresh automático: reconecta si caduca. No obtiene BPM, CUE ni audio de Spotify. No modifica rekordbox.
