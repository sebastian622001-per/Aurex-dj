/* Spotify OAuth PKCE: public client, no secret. */
(()=>{'use strict';
const CLIENT_ID='096b10c9544d4ea6b0e60c34f8e24f8b';
const redirect=location.origin+location.pathname;
const $=id=>document.getElementById(id);
const status=s=>{$('spotify-status').textContent=s};
const base64url=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
async function login(){
 if(!isSecureContext||location.protocol==='file:'){status('Publica AUREX mediante HTTPS antes de conectar Spotify.');return}
 const verifier=base64url(crypto.getRandomValues(new Uint8Array(64)));
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier)));
 const state=base64url(crypto.getRandomValues(new Uint8Array(24)));
 sessionStorage.setItem('spotify_pkce_verifier',verifier);sessionStorage.setItem('spotify_oauth_state',state);
 const p=new URLSearchParams({client_id:CLIENT_ID,response_type:'code',redirect_uri:redirect,code_challenge_method:'S256',code_challenge:base64url(digest),state,scope:'playlist-read-private playlist-read-collaborative'});
 location.assign('https://accounts.spotify.com/authorize?'+p);
}
async function tokenRequest(body){const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(body)});const j=await r.json();if(!r.ok)throw Error(j.error_description||j.error||'Spotify rechazó la solicitud');return j}
async function callback(){const p=new URLSearchParams(location.search);if(!p.has('code')&&!p.has('error'))return;
 history.replaceState({},'',redirect);
 if(p.has('error')){status('Autorización cancelada: '+p.get('error'));return}
 const state=sessionStorage.getItem('spotify_oauth_state'),verifier=sessionStorage.getItem('spotify_pkce_verifier');
 sessionStorage.removeItem('spotify_oauth_state');sessionStorage.removeItem('spotify_pkce_verifier');
 if(!state||p.get('state')!==state||!verifier){status('La sesión OAuth no coincide. Reintenta la conexión.');return}
 try{const t=await tokenRequest({client_id:CLIENT_ID,grant_type:'authorization_code',code:p.get('code'),redirect_uri:redirect,code_verifier:verifier});sessionStorage.setItem('spotify_token',t.access_token);status('Spotify conectado para esta sesión.');await playlists()}catch(e){status('Error de conexión: '+e.message)}
}
async function api(path){const token=sessionStorage.getItem('spotify_token');if(!token)throw Error('Conecta Spotify primero');const r=await fetch('https://api.spotify.com/v1'+path,{headers:{Authorization:'Bearer '+token}});if(!r.ok)throw Error('Spotify API HTTP '+r.status+'; quizá haya restricciones de acceso o haya caducado la sesión');return r.json()}
async function playlists(){try{status('Consultando playlists autorizadas…');let url='/me/playlists?limit=50',items=[];for(let n=0;n<10&&url;n++){const j=await api(url);items.push(...(j.items||[]));url=j.next?new URL(j.next).pathname.replace('/v1','')+new URL(j.next).search:null}const select=$('spotify-playlists');select.replaceChildren();for(const p of items){const opt=document.createElement('option');opt.value=p.id;opt.textContent=p.name;select.append(opt)}status('Encontradas '+items.length+' playlists. Selecciona una para importar sus metadatos.')}catch(e){status(e.message)}}
async function importPlaylist(){const id=$('spotify-playlists').value;if(!id)return status('Selecciona una playlist.');try{status('Leyendo canciones…');let url='/playlists/'+encodeURIComponent(id)+'/items?limit=50',items=[];for(let n=0;n<20&&url;n++){const j=await api(url);items.push(...(j.items||[]));url=j.next?new URL(j.next).pathname.replace('/v1','')+new URL(j.next).search:null}let count=0,skipped=0;const existing=new Set(tracks.filter(t=>t.spotifyId).map(t=>t.spotifyId));for(const item of items){const t=item.item||item.track;if(!t||!t.name||!t.duration_ms||t.type&&t.type!=='track')continue;if(t.id&&existing.has(t.id)){skipped++;continue}if(t.id)existing.add(t.id);tracks.push({name:t.name,artist:(t.artists||[]).map(a=>a.name).join(', '),genre:'Otro',bpm:null,duration:Math.round(t.duration_ms/1000),source:'spotify-metadata',spotifyId:t.id||null,analysis:'Solo metadatos: sin audio, BPM, estructura ni CUE verificados'});count++}save();status('Importadas '+count+' pistas como metadatos; '+skipped+' duplicadas omitidas. No se analizó audio ni se descargaron canciones.')}catch(e){status(e.message)}}
$('spotify-login').addEventListener('click',login);$('spotify-load').addEventListener('click',playlists);$('spotify-import').addEventListener('click',importPlaylist);$('spotify-redirect').textContent=redirect;
$('spotify-disconnect').addEventListener('click',()=>{sessionStorage.removeItem('spotify_token');$('spotify-playlists').replaceChildren();status('Sesión local desconectada. Para revocar acceso usa la configuración de tu cuenta Spotify.')});
callback();
})();
