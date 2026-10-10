(function(){
  // Make PDF links absolute so they open in a new tab

  // Event status chips
  const today=new Date(); const t0=new Date(today.getFullYear(),today.getMonth(),today.getDate()).getTime();
  document.querySelectorAll('.card[data-date]').forEach(c=>{
    const [y,m,d]=c.dataset.date.split('-').map(Number); const dt=new Date(y,m-1,d).getTime();
    const chip=c.querySelector('.chip');
    if(dt===t0){chip.textContent='Today';chip.classList.add('today')}
    else if(dt<t0){chip.textContent='Held · '+chip.textContent}
  });

  // Tributes
  const T=[
    {q:"Thank you for being my mother. Thank you for being my friend. Thank you for every prayer you prayed over my life. Rest peacefully, Mum.",w:"Osaretin John Iyekowa, Son",i:"OJ"},
    {q:"As I say goodbye, I choose to hold on to gratitude rather than sorrow, to be thankful that God blessed me with a mother like you.",w:"Pastor Mercy Chiadika, Daughter",i:"MC"},
    {q:"I love and miss you daily and will never forget your chant, “Thank you Jesus, Thank you Lord.” Rest well in the bosom of the Lord.",w:"Andrew Uyiwmen Iyekowa, Son",i:"AI"},
    {q:"Grandma would always pray for us with so much love, and cook the best food for us on every occasion. We love you, Grandma. Thank you for everything.",w:"Joel Iyekowa, Grandson",i:"JI"}
  ];
  const qs='<svg viewBox="0 0 32 24"><path d="M0 24V13C0 5 4 1 12 0v5c-4 1-6 3-6 7h6v12zm18 0V13c0-8 4-12 12-13v5c-4 1-6 3-6 7h6v12z"/></svg>';
  const slider=document.getElementById('slider'); let ti=1;
  function renderT(){
    const n=T.length, idx=[(ti-1+n)%n,ti,(ti+1)%n];
    slider.innerHTML=idx.map((k,j)=>`<button class="tcard${j===1?' active':''}" data-k="${k}" aria-label="Tribute from ${T[k].w}"><span class="q">${qs}<span>${T[k].q}</span></span><span class="dots"><i></i><i></i></span><span class="av">${T[k].i}</span><span class="who">${T[k].w}</span></button>`).join('');
    slider.querySelectorAll('.tcard').forEach(b=>b.onclick=()=>{ti=+b.dataset.k;renderT()});
  }
  document.getElementById('tPrev').onclick=()=>{ti=(ti-1+T.length)%T.length;renderT()};
  document.getElementById('tNext').onclick=()=>{ti=(ti+1)%T.length;renderT()};
  renderT();

  // Gallery slideshow
  const P=[
    ['g04','Hands folded in prayer'],['g05','In red and white'],['g11','Her warm smile'],['g18','Waving in blue'],
    ['g10','In red and coral'],['g02','In white lace'],['g13','With family'],['g14','Family together'],
    ['g08','Children and family'],['g17','The family in white and blue'],['g07','Family portrait'],['g01','Grandchildren and family'],
    ['g03','Lifting hands in worship'],['g06','At an evening event'],['g12','Family in gold'],['g15','Family in tribute T-shirts'],
    ['g09','Night of Tribute']
  ];
  const stage=document.getElementById('stage'),thumbs=document.getElementById('thumbs'),count=document.getElementById('count'),cap=document.getElementById('cap'),prog=document.getElementById('progress'),play=document.getElementById('play');
  const slides=P.map(([f,c],i)=>{const s=document.createElement('div');s.className='slide';s.innerHTML=`<div class="bg" style="background-image:url(img/${f}.jpg)"></div><img src="img/${f}.jpg" alt="${c}" ${i>1?'loading="lazy"':''}>`;stage.insertBefore(s,stage.querySelector('.ctrl'));return s});
  P.forEach(([f,c],i)=>{const b=document.createElement('button');b.setAttribute('aria-label','Show photo '+(i+1));b.innerHTML=`<img src="img/${f}.jpg" alt="" loading="lazy">`;b.onclick=()=>{go(i);restart()};thumbs.appendChild(b)});
  let cur=0,timer=null,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;const DUR=5000;
  const pad=n=>String(n).padStart(2,'0');
  function go(i){
    cur=(i+P.length)%P.length;
    slides.forEach((s,k)=>s.classList.toggle('on',k===cur));
    [...thumbs.children].forEach((b,k)=>b.classList.toggle('on',k===cur));
    count.textContent=pad(cur+1)+' / '+pad(P.length); cap.textContent=P[cur][1];
    const tb=thumbs.children[cur]; thumbs.scrollTo({left:tb.offsetLeft-thumbs.clientWidth/2+43,behavior:'smooth'});
  }
  function bar(){prog.style.transition='none';prog.style.width='0';if(!playing)return;void prog.offsetWidth;prog.style.transition='width '+DUR+'ms linear';prog.style.width='100%'}
  function restart(){clearInterval(timer);bar();if(playing)timer=setInterval(()=>{go(cur+1);bar()},DUR)}
  document.getElementById('gPrev').onclick=()=>{go(cur-1);restart()};
  document.getElementById('gNext').onclick=()=>{go(cur+1);restart()};
  play.onclick=()=>{playing=!playing;play.textContent=playing?'Pause':'Play';play.setAttribute('aria-pressed',playing);restart()};
  play.textContent=playing?'Pause':'Play';
  stage.tabIndex=0;stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){go(cur-1);restart()}if(e.key==='ArrowRight'){go(cur+1);restart()}});
  let sx=null;stage.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
  stage.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){go(cur+(dx<0?1:-1));restart()}sx=null});
  go(0);restart();

  // Background music (starts only on a tap; browsers block autoplay with sound)
  const SONGS=[{t:'Your Legacy Lives On',f:'media/song-legacy-lives-on.mp3'},{t:'Helen Iyekowa, Your Legacy',f:'media/song-your-legacy.mp3'}];
  const audio=new Audio();audio.preload='none';let si=0;
  const music=document.getElementById('music'),mPlay=document.getElementById('mPlay'),mTitle=document.getElementById('mTitle'),heroSong=document.getElementById('heroSong');
  const ICON_PLAY='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',ICON_PAUSE='<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  function loadSong(i){si=(i+SONGS.length)%SONGS.length;audio.src=SONGS[si].f;mTitle.textContent=SONGS[si].t}
  function syncMusic(){const on=!audio.paused;music.classList.toggle('playing',on);mPlay.innerHTML=on?ICON_PAUSE:ICON_PLAY;mPlay.setAttribute('aria-label',on?'Pause tribute song':'Play tribute song');heroSong.textContent=on?'Pause Her Song':'Play Her Song'}
  function toggleMusic(){if(!audio.src)loadSong(0);if(audio.paused){audio.play().catch(()=>{});}else audio.pause()}
  loadSong(0);
  mPlay.onclick=toggleMusic;heroSong.onclick=toggleMusic;
  document.getElementById('mNext').onclick=()=>{const was=!audio.paused;loadSong(si+1);if(was)audio.play().catch(()=>{})};
  audio.addEventListener('ended',()=>{loadSong(si+1);audio.play().catch(()=>{})});
  ['play','pause'].forEach(e=>audio.addEventListener(e,syncMusic));

  // Films
  const FILMS=[
    {f:'film-helen-iyekowa',p:'m09',t:'Helen Iyekowa',s:'Tribute film',d:'5:17'},
    {f:'film-grandma-hellen',p:'m08',t:'Grandma Hellen Iyekowa',s:'Tribute film',d:'3:11'}
  ];
  const CLIPS=[
    {f:'m10',t:'Mummy speaks',d:'0:59'},{f:'m01',t:'Praying over a grandchild',d:'0:06'},{f:'m03',t:'Dancing in green',d:'0:31'},
    {f:'m04',t:'A quiet moment of prayer',d:'0:07'},{f:'m11',t:'Praising in blue',d:'0:04'},{f:'m12',t:'Dancing in praise',d:'0:05'},
    {f:'m13',t:'Rejoicing in church',d:'0:05'},{f:'m02',t:'Out and about',d:'0:14'},{f:'m06',t:'Animated portrait',d:'0:10'},
    {f:'m07',t:'Family moments, animated',d:'0:10'}
  ];
  const video=document.getElementById('video'),now=document.getElementById('now'),feat=document.getElementById('feat'),clips=document.getElementById('clips');
  feat.innerHTML=FILMS.map((v,i)=>`<button class="vitem${i===0?' on':''}" data-src="media/${v.f}.mp4" data-poster="media/poster-${v.p}.jpg" data-title="${v.t}"><img src="media/poster-${v.p}.jpg" alt="" loading="lazy"><span><strong>${v.t}</strong><small>${v.s}</small></span><span class="dur">${v.d}</span></button>`).join('');
  clips.innerHTML=CLIPS.map(v=>`<button class="clip" data-src="media/${v.f}.mp4" data-poster="media/poster-${v.f}.jpg" data-title="${v.t}" aria-label="Play ${v.t}"><img src="media/poster-${v.f}.jpg" alt="" loading="lazy"><span>${v.t}<b>${v.d}</b></span></button>`).join('');
  const all=[...feat.children,...clips.children];
  all.forEach(b=>b.onclick=()=>{
    all.forEach(x=>x.classList.toggle('on',x===b));
    video.poster=b.dataset.poster;video.src=b.dataset.src;now.textContent='Now showing · '+b.dataset.title;
    video.play().catch(()=>{});
    if(innerWidth<960)video.scrollIntoView({behavior:'smooth',block:'center'});
  });
  // Pause the song while a video plays, and resume after
  let resume=false;
  video.addEventListener('play',()=>{if(!audio.paused){resume=true;audio.pause()}});
  ['pause','ended'].forEach(e=>video.addEventListener(e,()=>{if(resume){resume=false;audio.play().catch(()=>{})}}));

  // Copy buttons
  document.querySelectorAll('.copy').forEach(b=>b.onclick=async()=>{
    try{await navigator.clipboard.writeText(b.dataset.copy);b.textContent='Copied'}
    catch(e){const r=document.createRange();r.selectNodeContents(b.previousElementSibling);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected'}
    setTimeout(()=>b.textContent='Copy',1800);
  });
})();
