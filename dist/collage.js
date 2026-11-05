/* A reading-room layer: the source paragraphs and their stable anchors stay intact. */
const collageGalleryState={kind:'all',query:''};
Object.assign(artwork,{
 'turner-study':{file:'assets/art-backgrounds/turner.jpg',title:'透纳：从安康圣母教堂门廊眺望威尼斯',credit:'J. M. W. Turner · 约1835 · The Met · 公共领域；威尼斯景观，仅用于背景色彩研究，非巴黎史料',source:'https://www.metmuseum.org/art/collection/search/437853'},
 'pissarro-boulevard':{file:'assets/art-backgrounds/pissarro.jpg',title:'毕沙罗：冬日清晨的蒙马特大道',credit:'Camille Pissarro · 1897 · The Met · 公共领域；巴黎蒙马特大道原作',source:'https://www.metmuseum.org/art/collection/search/437310'},
 'game-benjamin-companion':{file:'assets/game/benjamin-companion.png',title:'本雅明：同行（游戏立绘）',credit:'AI 角色立绘 · 本雅明形象的艺术演绎，非历史肖像或原作',href:'game.html'},
 'game-benjamin-thoughtful':{file:'assets/game/benjamin-thoughtful.png',title:'本雅明：沉思（游戏立绘）',credit:'AI 角色立绘 · 本雅明沉思神态的艺术演绎，非历史肖像或原作',href:'game.html'},
 'game-benjamin-concerned':{file:'assets/game/benjamin-concerned.png',title:'本雅明：忧虑（游戏立绘）',credit:'AI 角色立绘 · 本雅明忧虑神态的艺术演绎，非历史肖像或原作',href:'game.html'},
 'game-benjamin-resolute':{file:'assets/game/benjamin-resolute.png',title:'本雅明：坚定（游戏立绘）',credit:'AI 角色立绘 · 本雅明坚定神态的艺术演绎，非历史肖像或原作',href:'game.html'}
});
const collageDayVolumes=new Set(['A','B','F','G','Q','S','U','W','Y','b','i','l','r']);
const collageNightVolumes=new Set(['C','D','J','K','O','T','V','Z','k','p']);
function collageTone(c){return collageDayVolumes.has(c.code)?'day':collageNightVolumes.has(c.code)?'night':'dusk'}
function collageSafePosition(c,pos){
 let i=pos;
 // An English quotation and the translation following it form one reading unit.
 while(i<c.paragraphs.length-2&&/中文解析|中文译|中文翻译|译文[：:]/.test(c.paragraphs[i+1].slice(0,35)))i++;
 return i;
}
function collagePictures(c){
 const lengths=[],total=c.paragraphs.reduce((n,p,i)=>(lengths[i]=n+p.length,n+p.length),0);
 const limit=total>16000?5:total>9000?4:total>4000?3:c.paragraphs.length>6?2:0;
 const candidates=[];
 for(const e of atlasEntries){
  for(const m of e.matches){
   if(m.chapter!==c.id||m.pos<3||m.pos>=c.paragraphs.length-3)continue;
   const pos=collageSafePosition(c,m.pos);
   if(pos>=c.paragraphs.length-2)continue;
   candidates.push({entry:e,pos,at:lengths[pos],penalty:e.id==='person-benjamin'?.12:0});
  }
 }
 const slots=new Map(),used=new Set();
 for(let n=0;n<limit;n++){
  const target=total*(n+1)/(limit+1);
  const choices=candidates.filter(x=>!used.has(x.entry.id)&&![...slots.keys()].some(p=>Math.abs(p-x.pos)<4));
  choices.sort((a,b)=>(Math.abs(a.at-target)/Math.max(total,1)+a.penalty)-(Math.abs(b.at-target)/Math.max(total,1)+b.penalty));
  const selected=choices[0];
  if(selected){slots.set(selected.pos,selected.entry);used.add(selected.entry.id)}
 }
 return new Map([...slots].sort((a,b)=>a[0]-b[0]));
}
function collageIllustration(e,index){
 return `<aside class="collage-insert ${index%3===1?'collage-panorama':'collage-vignette'} collage-slip-${index%3}" aria-label="${esc(e.name)}的随文插图"><span class="collage-pin" aria-hidden="true"></span><a class="collage-image-link" href="#dossier/${e.id}">${plate(e.image,'collage-illustration')}<span class="collage-image-index">${e.kind==='place'?'LIEU':e.kind==='person'?'PORTRAIT':'FIGURE'} / ${esc(e.name)} <b>档案 ↗</b></span></a></aside>`;
}
reader=function(id,pos){
 if(legacyReadingLinks[id]){const a=legacyReadingLinks[id][pos||'0']||Object.values(legacyReadingLinks[id])[0];id=a.id}
 const c=bookById.get(id);if(!c)return library();
 const idx=chapters.indexOf(c),group=chapters.filter(x=>x.part===c.part),pics=collagePictures(c),sectionStarts=new Set(c.sections.map(s=>s.start));
 let pictureIndex=0;
 const text=c.paragraphs.map((p,i)=>{
  const classes=[/^\[[A-Za-z]|英文原文/.test(p)?'fragment':'',sectionStarts.has(i)?'collage-section-line':''].filter(Boolean).join(' ');
  return `<p id="p${i}" class="${classes}">${esc(p)}</p>${pics.has(i)?collageIllustration(pics.get(i),pictureIndex++):''}`;
 }).join('');
 return `<div class="reading book-reading collage-reading collage-${collageTone(c)}" data-cahier="${esc(c.code||c.part)}"><aside class="collage-sidebar"><a href="#library" class="back-link">← 全书导览</a><p class="side-part">${esc(bookPartTitle(c.part))}</p>${group.map(x=>`<a href="#read/${x.id}" ${x.id===id?'aria-current="page"':''}>${x.code?`<span>${esc(x.code)}</span>`:''}${esc(x.title)}</a>`).join('')}<a class="collage-gallery-tab" href="#gallery">图像画廊 ↗<small>Galerie des passages</small></a></aside><article><div class="reading-scene collage-frontispiece"><div class="reading-title"><p class="collage-book-name">《拱廊街计划》<em lang="fr">Le Livre des passages</em></p><p class="collage-cahier-label">${esc(c.code?'CAHIER '+c.code:bookPartTitle(c.part))}</p><h1>${esc(c.title)}</h1><p class="book-english">${esc(c.en)}</p><a class="collage-start-reading" href="#read/${id}/0">翻开这一卷 <span>↓</span></a></div>${plate(chapterArt(c),'chapter-painting',true)}</div><div class="reading-body collage-manuscript"><div class="collage-reader-ribbon"><span>${c.code?'卷轴 '+esc(c.code):esc(bookPartTitle(c.part))}</span><span>${c.paragraphs.length} 段导览材料</span><a href="#gallery/volume">卷轴图像 ↗</a></div><div class="tools">${c.paragraphs.length?`<button id="mark">${localStorage.getItem('read-'+id)?'已读':'标记为已读'}</button>`:''}<a href="#notebook">阅读札记 ↗</a></div>${c.paragraphs.length?'<p class="note collage-material-note">材料来自《内容导览》；包含摘引与解读，非经校勘的原著全文。引文版本与页码待核对。</p>':'<div class="missing-material"><h2>材料待补</h2><p>目录位置已建立。所提供的导览尚未收录这一篇目的独立材料。</p><a href="#library" class="primary-link">返回全书导览 ↗</a></div>'}${c.sections.length?`<details class="entry-outline"><summary>本卷章节线索 · ${c.sections.length} 节</summary>${c.sections.map(s=>`<a href="#read/${id}/${s.start}" class="outline-link">${esc(s.title)}</a>`).join('')}</details>`:''}<div class="collage-source-text">${text}</div><div class="tools book-pagination">${idx>0?`<a class="primary-link" href="#read/${chapters[idx-1].id}">← ${esc(chapters[idx-1].title)}</a>`:''}${idx<chapters.length-1?`<a class="primary-link" href="#read/${chapters[idx+1].id}">${esc(chapters[idx+1].title)} ↗</a>`:''}</div></div></article></div>`;
};
function collageGalleryItems(){
 const files=new Set(),items=[];
 const add=(key,kind,description,href)=>{const a=artwork[key];if(!a||files.has(a.file))return;files.add(a.file);items.push({key,kind,description,href,...a})};
 chapters.filter(c=>c.code).forEach(c=>add(chapterArt(c),'volume',c.en,'#read/'+c.id));
 atlasEntries.forEach(e=>add(e.image,e.kind,e.en+' '+e.category+' '+e.terms.join(' '),'#dossier/'+e.id));
 Object.keys(artwork).forEach(key=>add(key,'atelier','城市绘画与资料图像','#sources'));
 return items;
}
const collageGalleryKinds={all:'全部图像',volume:'三十六卷',place:'巴黎记忆',person:'巴黎人物',group:'城市群像',atelier:'画作与资料'};
function collageGalleryFiltered(){const q=collageGalleryState.query.trim().toLowerCase();return collageGalleryItems().filter(a=>(collageGalleryState.kind==='all'||a.kind===collageGalleryState.kind)&&(!q||[a.title,a.description,a.credit].join(' ').toLowerCase().includes(q)))}
function collageGalleryCards(){
 return collageGalleryFiltered().map((a,i)=>`<article class="collage-gallery-item" style="--gallery-i:${Math.min(i,8)}"><button class="collage-gallery-image" data-gallery-open="${esc(a.key)}" aria-label="放大查看：${esc(a.title)}"><img src="${a.file}" alt="${esc(a.title)}" loading="lazy" decoding="async"><span aria-hidden="true">↗</span></button><div class="collage-gallery-caption"><p>${esc(collageGalleryKinds[a.kind])}</p><h2><a href="${a.href}">${esc(a.title)}</a></h2><small>${a.source?`<a href="${a.source}" target="_blank" rel="noopener noreferrer">${esc(a.credit)} ↗</a>`:esc(a.credit)}</small><a class="collage-gallery-read" href="${a.href}">${a.kind==='volume'?'进入卷轴':a.kind==='atelier'?'版本与资料':'打开档案'} ↗</a></div></article>`).join('')||'<p class="collage-gallery-empty">没有找到相关图像。试试人物姓名、地名或卷轴主题。</p>';
}
function collageGalleryPage(){
 return `<section class="section collage-gallery"><div class="collage-gallery-heading"><div><p lang="fr">GALERIE DES PASSAGES</p><h1>图像画廊</h1><p>《拱廊街计划》<em lang="fr">Le Livre des passages</em></p></div><p class="collage-gallery-intro">卷轴的梦景、城市的地点与人群。<br>点击图像展开全幅，沿着标题回到文字。</p></div><div class="collage-gallery-controls"><div class="collage-gallery-filters" role="group" aria-label="按图像主题筛选">${Object.entries(collageGalleryKinds).map(([key,label])=>`<button data-gallery-kind="${key}" aria-pressed="${collageGalleryState.kind===key}">${label}<sup>${key==='all'?collageGalleryItems().length:collageGalleryItems().filter(x=>x.kind===key).length}</sup></button>`).join('')}</div><label class="collage-gallery-search">检索图像<input id="gallery-search" type="search" value="${esc(collageGalleryState.query)}" placeholder="拱廊 / 波德莱尔 / 时尚" autocomplete="off"></label></div><p id="gallery-status" class="collage-gallery-status" aria-live="polite">${collageGalleryFiltered().length} 幅图像 · 保留画面原色与完整构图</p><div id="gallery-grid" class="collage-gallery-grid">${collageGalleryCards()}</div><p class="collage-gallery-footnote">图像旁保留来源说明。AI 插图为艺术演绎；人物、建筑与服饰不能据此作史料考证。<a href="#sources">查看版本与资料 ↗</a></p><dialog id="collage-lightbox" class="collage-lightbox" aria-label="完整图像"><button class="collage-lightbox-close" aria-label="关闭完整图像">关闭 ×</button><div id="collage-lightbox-content"></div></dialog></section>`;
}
function bindCollageGalleryImages(){
 document.querySelectorAll('[data-gallery-open]').forEach(button=>button.onclick=()=>{
  const a=collageGalleryItems().find(x=>x.key===button.dataset.galleryOpen),dialog=document.querySelector('#collage-lightbox'),content=document.querySelector('#collage-lightbox-content');
  if(!a||!dialog||!content)return;
  content.innerHTML=`<figure><img src="${a.file}" alt="${esc(a.title)}"><figcaption><strong>${esc(a.title)}</strong><small>${esc(a.credit)}</small><a href="${a.href}">阅读相关文字 ↗</a>${a.source?`<a href="${a.source}" target="_blank" rel="noopener noreferrer">图像来源 ↗</a>`:''}</figcaption></figure>`;
  if(typeof dialog.showModal==='function')dialog.showModal();else window.open(a.file,'_blank','noopener');
 });
}
function updateCollageGallery(){
 const grid=document.querySelector('#gallery-grid'),status=document.querySelector('#gallery-status');if(!grid)return;
 grid.innerHTML=collageGalleryCards();if(status)status.textContent=collageGalleryFiltered().length+' 幅图像 · 保留画面原色与完整构图';
 document.querySelectorAll('[data-gallery-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.galleryKind===collageGalleryState.kind)));bindCollageGalleryImages();
}
function bindCollageGallery(){
 document.querySelectorAll('[data-gallery-kind]').forEach(b=>b.onclick=()=>{collageGalleryState.kind=b.dataset.galleryKind;updateCollageGallery()});
 const input=document.querySelector('#gallery-search');if(input)input.oninput=()=>{collageGalleryState.query=input.value;updateCollageGallery()};
 const dialog=document.querySelector('#collage-lightbox'),close=document.querySelector('.collage-lightbox-close');if(close)close.onclick=()=>dialog?.close();
 if(dialog)dialog.onclick=e=>{if(e.target===dialog)dialog.close()};bindCollageGalleryImages();
}
function decorateCollageShell(route){
 const brand=document.querySelector('.brand');if(brand)brand.innerHTML='《拱廊街计划》<span lang="fr">Le Livre des passages</span>';
 const nav=document.querySelector('header nav');if(nav&&!nav.querySelector('[data-gallery-nav]'))nav.insertAdjacentHTML('beforeend',`<a href="#gallery" class="nav-gallery" data-gallery-nav ${route==='gallery'?'aria-current="page"':''}>图像画廊 <span>↗</span></a>`);
 const footer=document.querySelector('footer');if(footer&&!footer.querySelector('[data-gallery-footer]'))footer.insertAdjacentHTML('beforeend','<a href="#gallery" class="footer-gallery" data-gallery-footer>图像画廊 · Galerie ↗</a>');
 if(!route&&!document.querySelector('.collage-gallery-invitation'))document.querySelector('.morandi-hero')?.insertAdjacentHTML('afterend',`<a class="collage-gallery-invitation" href="#gallery"><span class="collage-invitation-strip"><img src="assets/unique/volume-upper-A.jpg" alt="" loading="lazy"><img src="assets/unique/volume-upper-Y.jpg" alt="" loading="lazy"><img src="assets/unique/group-ragpicker.jpg" alt="" loading="lazy"></span><span><small lang="fr">LES IMAGES DU LIVRE</small><strong>翻开巴黎的图像档案</strong><em>卷轴、地点、人物与城市群像</em></span><b aria-hidden="true">↗</b></a>`);
 if(route==='sources'){
  document.querySelector('.section h1')?.insertAdjacentHTML('afterend','<a href="#gallery" class="primary-link collage-sources-gallery">打开图像画廊 ↗</a>');
  document.querySelector('.section')?.insertAdjacentHTML('beforeend','<div class="collage-painting-sources"><h2>背景中的原作</h2><p>日光卷轴采用毕沙罗《冬日清晨的蒙马特大道》（1897）的巴黎景观作背景。暮色卷轴采用透纳《从安康圣母教堂门廊眺望威尼斯》（约1835）的色彩作为装饰；画中地点是威尼斯，不作为巴黎历史图像。两幅原作均来自纽约大都会艺术博物馆公共领域馆藏。画廊保留原作完整构图与来源链接。</p><a href="https://www.metmuseum.org/art/collection/search/437310" target="_blank" rel="noopener noreferrer">毕沙罗原作与馆藏资料 ↗</a> · <a href="https://www.metmuseum.org/art/collection/search/437853" target="_blank" rel="noopener noreferrer">透纳原作与馆藏资料 ↗</a></div>');
 }
 if(route==='read'){const id=decodeURI(location.hash.slice(1)).split('/')[1],c=bookById.get(id);document.title=(c?c.title+' · ':'')+'《拱廊街计划》 | Le Livre des passages'}else document.title=(route==='gallery'?'图像画廊 · ':'')+'《拱廊街计划》 | Le Livre des passages';
}
const collageRenderOriginal=render;
render=function(){
 const [route,kind]=decodeURI(location.hash.slice(1)).split('/');
 if(route==='gallery'){
  if(typeof stopWalkingTour==='function')stopWalkingTour();
  if(kind&&collageGalleryKinds[kind])collageGalleryState.kind=kind;
  const app=document.querySelector('#app');if(app)app.innerHTML=collageGalleryPage();window.scrollTo(0,0);bindCollageGallery();
 }else collageRenderOriginal();
 decorateCollageShell(route);
};
removeEventListener('hashchange',collageRenderOriginal);addEventListener('hashchange',render);render();
