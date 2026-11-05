/* Every image has an explicit subject and provenance. */
const artwork={
 dream:{file:'assets/paris-dream.jpg',title:'拱廊中的巴黎之梦',credit:'AI 生成 · 十八世纪法国绘画风格的艺术演绎'},
 library:{file:'assets/library.jpg',title:'巴黎的藏书室',credit:'AI 生成 · 阅读与收藏主题插画'},
 fashion:{file:'assets/fashion.jpg',title:'丝绸、橱窗与时尚',credit:'AI 生成 · 十九世纪商业生活的绘画式演绎'},
 boulevard:{file:'assets/boulevard.jpg',title:'巴黎林荫大道',credit:'AI 生成 · 城市景观艺术演绎'},
 vivienne:{file:'assets/vivienne.jpg',title:'薇薇安长廊',credit:'AI 生成 · 建筑主题艺术演绎，非考据复原'},
 vero:{file:'assets/vero.jpg',title:'维罗—多达长廊内部',credit:'Gabrielle Robillard · Wikimedia Commons · 公共领域',source:'https://commons.wikimedia.org/wiki/File:Galerie_Vero-Dodat.JPG'},
 panoramas:{file:'assets/panoramas.jpg',title:'全景画拱廊街',credit:'AI 生成 · 建筑主题艺术演绎，非考据复原'},
 opera:{file:'assets/opera-painting.jpg',title:'消失的歌剧院拱廊街',credit:'AI 生成 · 想象性复原，非历史实景'},
 caire:{file:'assets/caire.jpg',title:'开罗拱廊街与印刷作坊',credit:'AI 生成 · 建筑主题艺术演绎，非考据复原'},
 baudelaire:{file:'assets/baudelaire.jpg',title:'夏尔·波德莱尔',credit:'AI 生成 · 历史人物艺术演绎，非原作肖像'},
 fourier:{file:'assets/fourier.jpg',title:'夏尔·傅立叶',credit:'AI 生成 · 历史人物艺术演绎，非原作肖像'},
 haussmann:{file:'assets/haussmann.jpg',title:'乔治—欧仁·奥斯曼',credit:'AI 生成 · 历史人物艺术演绎，非原作肖像'},
 grandville:{file:'assets/grandville.jpg',title:'格兰维尔',credit:'AI 生成 · 历史人物艺术演绎，非原作肖像'},
 benjamin:{file:'assets/benjamin.jpg',title:'瓦尔特·本雅明，约1928年',credit:'Wikimedia Commons · 公共领域 · 作者信息见资料页',source:'https://commons.wikimedia.org/wiki/File:Walter_Benjamin_vers_1928.jpg'},
 daguerre:{file:'assets/daguerre.jpg',title:'路易·达盖尔',credit:'AI 生成 · 历史人物艺术演绎，非原作肖像'}
};
const entityArt=['vivienne','vero','panoramas','opera','caire','baudelaire','fourier','haussmann','grandville','benjamin','daguerre'];
function plate(key,cls='',eager=false){let a=artwork[key]||artwork.library;return `<figure class="art-plate ${cls}"><img src="${a.file}" alt="${esc(a.title)}" loading="${eager?'eager':'lazy'}" decoding="async"><figcaption><span>${esc(a.title)}</span><small>${a.source?`<a href="${a.source}" target="_blank" rel="noopener">${esc(a.credit)} ↗</a>`:esc(a.credit)}</small></figcaption></figure>`}
image=function(e){return plate(entityArt[entities.indexOf(e)]||'dream',e[2]==='人物'?'portrait-plate':'place-plate')};
const plainHome=home;
home=function(){return plainHome().replace(`${art}<figcaption>巴黎拱廊空间 · 透视示意</figcaption>`,plate('dream','hero-painting',true)).replace('<h2>一本没有单一路径的书</h2>','<h2>一本没有单一路径的书</h2>').replace('<section class="section"><h2>阅读，仍在继续</h2>',`<section class="section painted-ending">${plate('library','ending-painting')}<div><h2>阅读，仍在继续</h2>`).replace(`浏览全部 ${chapters.length} 个阅读单元 →</a></section>`,`浏览全部 ${chapters.length} 个阅读单元 →</a></div></section>`)};
function chapterArt(c){let t=c.title;for(let i=0;i<entities.length;i++)if(t.includes(entities[i][0])||t.includes(entities[i][4]))return entityArt[i];if(/时尚|妓女|商品|百货|广告|新颖品/.test(t))return 'fashion';if(/奥斯曼|街道|路障|公社|铁路|城市|社会运动|波拿巴/.test(t))return 'boulevard';if(/铁|拱廊|建筑|全景|世博|世界博览/.test(t))return 'dream';if(/波德莱尔/.test(t))return 'baudelaire';return 'library'}
const plainReader=reader;
reader=function(id,pos){let c=chapters.find(x=>x.id===id);if(!c)return plainReader(id,pos);let html=plainReader(id,pos),key=chapterArt(c);html=html.replace('</h1>',`</h1>${plate(key,'chapter-painting',true)}`);let inserted=0;for(let i=0;i<c.paragraphs.length&&inserted<2;i++){if(i<4)continue;let p=c.paragraphs[i];let ei=entities.findIndex(e=>p.includes(e[4]));if(ei<0||entityArt[ei]===key)continue;let marker=`<p id="p${i}"`;html=html.replace(marker,`<div class="illustrated-aside"><a href="#entity/${ei}">${image(entities[ei])}<span>沿着${esc(entities[ei][0])}的线索继续阅读 ↗</span></a></div>${marker}`);inserted++}return html};
const plainLibrary=library;
library=function(term=''){return plainLibrary(term).replace('<h1>卷轴书库</h1>',`<div class="illustrated-heading"><div><h1>卷轴书库</h1><p class="art-motto">在纸页之间，收藏一座城市。</p></div>${plate('library','library-painting',true)}</div>`)};
const plainRenderArt=render;
render=function(){plainRenderArt();let route=decodeURI(location.hash.slice(1)).split('/')[0];if(route==='notebook'){document.querySelector('.section h1')?.insertAdjacentHTML('afterend',plate('library','notebook-painting',true))}if(route==='places'){document.querySelector('.section h1')?.insertAdjacentHTML('afterend',plate('boulevard','route-painting',true))}if(route==='people'){document.querySelectorAll('.people>a').forEach(a=>{let i=+a.hash.split('/')[1];a.insertAdjacentHTML('afterbegin',image(entities[i]))})}if(route==='sources'){let section=document.querySelector('.section');section.innerHTML=`<h1>图像、版本与资料</h1>${plate('library','route-painting',true)}<p>页面以十八世纪法国洛可可与风俗绘画的色彩、笔触组织视觉。书中的人物、地点仍按各自历史时期呈现。生成插画均为艺术演绎，不能作为肖像考证或建筑复原依据。</p><h2>图像目录</h2><div class="art-credits">${Object.entries(artwork).map(([key,a])=>`<div>${plate(key)}<p>${esc(a.title)}</p></div>`).join('')}</div><h2>文本版本</h2><p>文本来自用户提供的《内容导览.docx》，包含译文、摘引与解读，并非经过校勘的全书。保留文档中的笔记编号，版本、页码与引文归属待核对。</p>`}};
removeEventListener('hashchange',plainRenderArt);addEventListener('hashchange',render);render();
