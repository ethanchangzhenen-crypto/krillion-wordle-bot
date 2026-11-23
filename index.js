// Krillion + Wordle WhatsApp GC Bot - Baileys (WhatsApp Web)
// Commands: !help, !krillion daily, !krillion unlimited, !wordle daily, !wordle unlimited, !score, !quit, !skip
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
const fs = require('fs');
const 【entity-express¦canonical_name=express】 = require('【entity-express¦canonical_name=express】');
const QRCode = require('qrcode');

// --- QR WEB PAGE (Railway domain) ---
let currentQR = null;
let botStatus = 'Starting...';
const app = 【entity-express¦canonical_name=express】();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="5"><title>Krillion + Wordle Bot - Scan QR</title><style>body{font-family:system-ui,sans-serif;background:#111b21;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center} .card{background:#fff;color:#111;border-radius:16px;padding:24px;max-width:420px;width:100%} h1{font-size:22px;margin:0 0 8px} p{color:#555} img{width:280px;height:280px} .ok{color:#25D366;font-weight:700;font-size:20px} code{background:#eee;padding:2px 6px;border-radius:6px}</style></head><body><h1>🦐 Krillion + Wordle Bot</h1>${botStatus==='connected' ? `<div class="card"><div class="ok">✅ Connected!</div><p>Bot is online. Add it to your WhatsApp GC and type <code>!help</code></p><p>Commands: !krillion official / !krillion daily / !krillion unlimited / !wordle daily / !wordle unlimited</p></div>` : currentQR ? `<div class="card"><h1>Scan with WhatsApp</h1><p>WhatsApp &gt; Settings &gt; Linked Devices &gt; Link a Device</p><img src="/qr.png" alt="QR"><p>This page auto-refreshes every 5s. QR expires in ~20s, a new one will appear.</p></div>` : `<div class="card"><h1>Waiting for QR...</h1><p>Status: ${botStatus}</p><p>Refresh in a few seconds.</p></div>`}<p style="margin-top:16px;color:#aaa">Status: ${botStatus}</p></body></html>`);
});
app.get('/qr.png', async (req, res) => {
  if (!currentQR) return res.status(404).send('No QR yet');
  try { const buf = await QRCode.toBuffer(currentQR, { width: 400, margin: 1 }); res.type('png').send(buf); } catch(e){ res.status(500).send('QR error'); }
});
app.get('/status', (req, res) => res.json({ status: botStatus, hasQR: !!currentQR }));
app.listen(PORT, () => console.log('🌐 QR page on port ' + PORT));

const KRILLION_PROMPTS = [
  {q:"Name a type of cheese", answers:{brie:30,cheddar:10,gouda:30,parmesan:10,mozzarella:10,camembert:50,gruyere:50,manchego:70,stilton:70,roquefort:90,comte:90,taleggio:100}},
  {q:"Name a fruit", answers:{apple:10,banana:10,orange:10,mango:30,kiwi:30,pear:30,durian:50,dragonfruit:50,lychee:50,persimmon:70,rambutan:70,feijoa:90,loquat:100}},
  {q:"Name a country in Europe", answers:{france:10,italy:10,germany:10,spain:10,portugal:30,greece:30,norway:30,finland:50,croatia:50,estonia:70,slovenia:70,liechtenstein:90,andorra:100}},
  {q:"Name an animal", answers:{dog:10,cat:10,lion:10,tiger:30,elephant:30,penguin:30,koala:50,capybara:50,axolotl:70,quokka:70,pangolin:90,okapi:100}},
  {q:"Name a city in Asia", answers:{tokyo:10,seoul:10,bangkok:10,singapore:10,hanoi:30,jakarta:30,manila:30,taipei:50,chiangmai:70,penang:70,daegu:90,busan:50,luangprabang:100}},
  {q:"Name a sport", answers:{soccer:10,football:10,basketball:10,tennis:30,swimming:30,badminton:30,archery:50,fencing:50,curling:70,padel:70,kabaddi:90,sepaktakraw:100}},
  {q:"Name a colour", answers:{red:10,blue:10,green:10,pink:30,purple:30,orange:30,teal:50,maroon:50,magenta:70,turquoise:70,chartreuse:90,periwinkle:100}},
  {q:"Name a musical instrument", answers:{piano:10,guitar:10,violin:10,drums:10,flute:30,trumpet:30,cello:50,harp:50,ukulele:50,saxophone:50,erhu:70,kazoo:90,theremin:100}},
  {q:"Name a vegetable", answers:{carrot:10,potato:10,broccoli:10,spinach:30,cucumber:30,eggplant:30,okra:50,leek:50,artichoke:70,bokchoy:70,kohlrabi:90,romanesco:100}},
  {q:"Name a book", answers:{harrypotter:10,dune:30,book1984:30,thehobbit:30,prideandprejudice:50,percyjackson:50,thealchemist:50,projecthailmary:70,crimeandpunishment:70,houseofleaves:100}},
  {q:"Name a movie", answers:{avatar:10,avengers:10,titanic:10,barbie:10,interstellar:30,parasite:30,spiritedaway:50,coco:50,ratatouille:50,amadeus:90,whiplash:70,oldboy:90}},
  {q:"Name a drink", answers:{water:10,coffee:10,tea:10,coke:10,lemonade:30,milkshake:30,matcha:50,bubbletea:50,horchata:70,sugarcane:70,kombucha:70,bandung:90,tehtarik:50}},
  {q:"Name a job", answers:{teacher:10,doctor:10,engineer:10,chef:30,lawyer:30,farmer:30,astronaut:50,firefighter:50,librarian:50,beekeeper:70,locksmith:70,cartographer:90,chimneysweep:100}},
  {q:"Name a dessert", answers:{cake:10,icecream:10,brownie:10,cookies:10,tiramisu:50,cheesecake:30,mochi:50,cremebrulee:70,baklava:70,pavlova:70,bingsoo:70,ondehondeh:90}},
  {q:"Name a superhero", answers:{superman:10,batman:10,spiderman:10,ironman:10,wonderwoman:30,thor:30,blackpanther:50,deadpool:50,antman:70,doctorstrange:50,moonknight:90,shangchi:70}},
  {q:"Name a breakfast food", answers:{eggs:10,pancakes:10,cereal:10,toast:10,oatmeal:30,bacon:30,waffles:30,dimsum:50,nasilemak:70,congee:50,rotiprata:70,acai:70}},
  {q:"Name a sea animal", answers:{fish:10,shark:10,dolphin:30,octopus:30,whale:30,jellyfish:50,turtle:50,starfish:50,seahorse:70,manatee:70,blobfish:100}},
  {q:"Name a cartoon character", answers:{【entity-mickey¦canonical_name=Mickey Mouse】:10,【entity-spongebob¦canonical_name=spongebob】:10,pikachu:10,bart:30,【entity-shrek¦canonical_name=shrek】:30,bugs:30,tomjerry:50,scoobydoo:50,【entity-doraemon¦canonical_name=doraemon】:50,gumball:70,phineas:70,adventuretime:90}}
];
const WORDLE_WORDS = ["APPLE","BRAVE","CRANE","DANCE","EAGLE","FLAME","GRAPE","HOUSE","IGLOO","JUNGLE","KOALA","LEMON","MANGO","NIGHT","OCEAN","PIANO","QUEEN","RIVER","SUNNY","TIGER","UMBRA","VIVID","WATER","ZEBRA","CLOUD","DREAM","EARTH","FROST","GLOW","HAPPY","IVORY","KITE","LIGHT","MOON","NEST","ORANGE","PEACH","QUICK","ROBIN","STONE","TABLE","UNITY","VANILLA","WIND","YOUTH","ZEST","BERRY","CHESS","ECHO","FABLE","GARDEN","HONEY","ISLAND","JOURNEY","KING","LAGOON","MAGIC","NOBLE","OPAL","PILOT","QUEST","ROSE","SILVER","TRAVEL","URBAN","VALLEY","WINTER","YOGA","ZENITH","AMBER","BREEZE","CANDLE","DAISY","EMBER","FALCON","GARNET","HARVEST","IRIS","JEWEL","LANTERN","MEADOW","NOVA","ORBIT","PEARL","QUARTZ","RAIN","SUMMIT","THUNDER","ULTRA","VELVET","WANDER","YARN","ZEAL"];
function seededRandom(seedStr){ let h=2166136261; for(let i=0;i<seedStr.length;i++){ h^=seedStr.charCodeAt(i); h=Math.imul(h,16777619); } return function(){ h+=0x6D2B79F5; let t=h; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; } }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function pickDailyPrompts(){ const rnd=seededRandom("krillion-"+todayStr()); const copy=[...KRILLION_PROMPTS]; const out=[]; for(let i=0;i<7;i++) out.push(copy.splice(Math.floor(rnd()*copy.length),1)[0]); return out; }
function pickRandomPrompts(){ const copy=[...KRILLION_PROMPTS]; const out=[]; for(let i=0;i<7;i++) out.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]); return out; }
function pickDailyWordle(){ const rnd=seededRandom("wordle-"+todayStr()); return WORDLE_WORDS[Math.floor(rnd()*WORDLE_WORDS.length)]; }
function pickRandomWordle(){ return WORDLE_WORDS[Math.floor(Math.random()*WORDLE_WORDS.length)]; }
function normalize(s){ return s.toLowerCase().replace(/[^a-z0-9]/g,''); }
function tierName(p){ if(p>=100) return "One in a Krillion"; if(p>=90) return "Ultra Rare"; if(p>=70) return "Very Rare"; if(p>=50) return "Rare"; if(p>=30) return "Uncommon"; return "Plankton"; }
function wordleFeedback(guess, answer){ const g=guess.split(''), a=answer.split(''); const res=new Array(5).fill('⬛'); const counts={}; for(let i=0;i<5;i++) if(g[i]===a[i]) res[i]='🟩'; else counts[a[i]]=(counts[a[i]]||0)+1; for(let i=0;i<5;i++) if(res[i]!=='🟩'){ if(counts[g[i]]>0){res[i]='🟨'; counts[g[i]]--;} } return res.join(''); }
const games = new Map();
const scores = new Map();
function getScore(id){ if(!scores.has(id)) scores.set(id,{krillionBest:0, wordleWins:0, wordleGames:0}); return scores.get(id); }
async function send(sock, jid, text, quoted){ await sock.sendMessage(jid,{text},{quoted}); }
function helpText(){ return "🎮 *Krillion + Wordle Bot*\n\n*Krillion*\n!krillion official - TODAY'S OFFICIAL prompts from krillion.io (play in GC, replayable)\n!krillion daily - Bot daily dive (same for everyone, replayable)\n!krillion unlimited - Random dive\n\n*Wordle*\n!wordle daily - Today's word (same for everyone, replayable)\n!wordle unlimited - Random word\n\n*Other*\n!score - Your stats\n!quit - Quit current game\n!skip - Skip Krillion prompt\n\nOfficial Krillion scoring is only on krillion.io (1 try). Bot scoring is for fun in GC.\nIn a game, just type your answer/guess. No ! needed."; }
async function startKrillion(sock, jid, mode, quoted){ const prompts = mode==='daily' ? pickDailyPrompts() : pickRandomPrompts(); games.set(jid,{type:'krillion', mode, prompts, idx:0, total:0, answers:[]}); await send(sock,jid,"🦐 *KRILLION - "+mode.toUpperCase()+" DIVE*\n\n7 prompts. Rarer answer = more points. Max 700.\nYou can play this daily multiple times!\n\n*Prompt 1/7:*\n"+prompts[0].q+"\n\nType your answer (or !skip / !quit)", quoted); }
async function startWordle(sock, jid, mode, quoted){ const answer = mode==='daily' ? pickDailyWordle() : pickRandomWordle(); games.set(jid,{type:'wordle', mode, answer, guesses:[], attempts:0}); await send(sock,jid,"🟩 *WORDLE - "+mode.toUpperCase()+"*\n\nGuess the 5-letter word. You have 6 tries.\nSame word for everyone today if daily. Replayable!\n\nType a 5-letter word (e.g. CRANE)", quoted); }
async function startOfficialKrillion(sock, jid, quoted){
  let data;
  try{ data = JSON.parse(fs.readFileSync('./official-today.json','utf8')); } catch(e){ await send(sock,jid,"Official prompts file not found. Ask admin to update official-today.json",quoted); return; }
  const prompts = data.prompts.map(q=>({q, answers:{}}));
  games.set(jid,{type:'krillion-official', mode:'official', prompts, idx:0, total:0, answers:[], date:data.date});
  const list = data.prompts.map((p,i)=>(i+1)+". "+p).join('\n');
  await send(sock,jid,"🦐 *KRILLION OFFICIAL - "+data.date+"*\nSource: krillion.io\n\n"+list+"\n\nPlay in GC: I will ask you 1 by 1. Any valid answer counts as 50 pts in GC (practice score). For REAL official score (rarity vs all players), play once on krillion.io\n\n*Prompt 1/7:*\n"+prompts[0].q, quoted);
}
async function handleMessage(sock, msg){
  if(!msg.message) return;
  const jid = msg.key.remoteJid;
  const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
  if(!text || msg.key.fromMe) return;
  const raw = text.trim();
  const lower = raw.toLowerCase();
  const game = games.get(jid);
  if(lower==='!help' || lower==='!menu' || lower==='!start'){ await send(sock,jid,helpText(),msg); return; }
  if(lower==='!score'){ const s=getScore(jid); await send(sock,jid,"📊 *Your Stats*\n🦐 Krillion best: "+s.krillionBest+"/700\n🟩 Wordle wins: "+s.wordleWins+"/"+s.wordleGames,msg); return; }
  if(lower==='!quit'){ if(game){ games.delete(jid); await send(sock,jid,"Game quit. Type !help to start again.",msg);} else await send(sock,jid,"No game running. Type !help",msg); return; }
  if(lower==='!krillion daily'){ await startKrillion(sock,jid,'daily',msg); return; }
  if(lower==='!krillion official'){ await startOfficialKrillion(sock,jid,msg); return; }
  if(lower==='!krillion unlimited' || lower==='!krillion'){ await startKrillion(sock,jid,'unlimited',msg); return; }
  if(lower==='!wordle daily'){ await startWordle(sock,jid,'daily',msg); return; }
  if(lower==='!wordle unlimited' || lower==='!wordle'){ await startWordle(sock,jid,'unlimited',msg); return; }
  if(game && (game.type==='krillion' || game.type==='krillion-official')){
    if(lower==='!skip'){ game.answers.push("skipped (0)"); }
    else if(game.type==='krillion-official'){ game.total+=50; game.answers.push(raw+" - 50 pts (practice - real rarity only on krillion.io)"); }
    else {
      const prompt = game.prompts[game.idx];
      const points = prompt.answers[normalize(raw)];
      if(points===undefined){ await send(sock,jid,"❌ Not recognised for \""+prompt.q+"\". Try another answer! (rarer = more points)",msg); return; }
      game.total+=points; game.answers.push(raw+" - "+points+" pts ("+tierName(points)+")");
    }
    game.idx++;
    if(game.idx>=7){
      const s=getScore(jid); if(game.total>s.krillionBest) s.krillionBest=game.total;
      const summary = "🏁 *KRILLION DONE!* ("+game.mode+")\n\n" + game.answers.map((a,i)=>(i+1)+". "+a).join('\n') + "\n\n*Total: "+game.total+(game.type==='krillion-official' ? "/350 practice" : "/700")+"*\n*Depth: "+(game.total*10)+"m*\n"+(game.type==='krillion-official' ? "\nThis is PRACTICE score. For real official rarity score, play once on krillion.io\n" : "")+"\nPlay again: !krillion official / !krillion daily / !krillion unlimited";
      games.delete(jid); await send(sock,jid,summary,msg); return;
    } else {
      const next = game.prompts[game.idx];
      await send(sock,jid,"✅ "+game.answers[game.answers.length-1]+"\n*Total so far: "+game.total+"*\n\n*Prompt "+(game.idx+1)+"/7:*\n"+next.q,msg); return;
    }
  }
  if(game && game.type==='wordle'){
    if(!/^[a-zA-Z]{5}$/.test(raw)){ await send(sock,jid,"Wordle needs exactly 5 letters. Try again! Or !quit",msg); return; }
    const guess=raw.toUpperCase(); game.attempts++; game.guesses.push(guess);
    const fb = wordleFeedback(guess, game.answer);
    if(guess===game.answer){ const s=getScore(jid); s.wordleGames++; s.wordleWins++; games.delete(jid); await send(sock,jid,"🎉 *WORDLE SOLVED in "+game.attempts+"/6!*\n"+fb+"\n\nWord was *"+game.answer+"*\n\nPlay again: !wordle daily / !wordle unlimited",msg); return; }
    if(game.attempts>=6){ const s=getScore(jid); s.wordleGames++; games.delete(jid); await send(sock,jid,"😢 Out of guesses! Word was *"+game.answer+"*\n\nPlay again: !wordle daily / !wordle unlimited",msg); return; }
    await send(sock,jid,fb+"  ("+game.attempts+"/6)\n"+game.guesses.join(' ')+"\n\nNext guess:",msg); return;
  }
  if(lower.startsWith('!')){ await send(sock,jid,"Unknown command. Type !help",msg); }
}
async function start(){
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({ version, logger: pino({level:'silent'}), auth: state });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u)=>{
    const { connection, lastDisconnect, qr } = u;
    if(qr){ currentQR = qr; botStatus = 'waiting for scan'; qrcode.generate(qr,{small:true}); }
    if(connection==='close'){ botStatus = 'disconnected - reconnecting...'; currentQR = null; const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut; console.log('Connection closed, reconnecting:', shouldReconnect); if(shouldReconnect) start(); }
    else if(connection==='open'){ botStatus = 'connected'; currentQR = null; console.log('✅ Bot connected! Add it to your GC and type !help'); }
  });
  sock.ev.on('messages.upsert', async ({messages})=>{ for(const m of messages) await handleMessage(sock,m); });
}
start();
