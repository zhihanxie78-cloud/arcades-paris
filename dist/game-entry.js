const renderBeforeJourneyEntry=render;
function addJourneyEntry(){const nav=document.querySelector('header nav');if(nav&&!nav.querySelector('[data-journey-entry]'))nav.insertAdjacentHTML('beforeend','<a href="game.html" data-journey-entry>互动漫游 ↗</a>');const homeHero=document.querySelector('.morandi-hero');if(homeHero&&!document.querySelector('.journey-invitation'))homeHero.insertAdjacentHTML('afterend','<section class="journey-invitation"><div><p lang="fr">Une amitié à Paris</p><h2>与本雅明同行</h2><p>成为他的朋友，一起走过巴黎的地点、人物与故事。</p></div><a class="primary-link" href="game.html">进入独立游戏 ↗</a></section>')}
render=function(){renderBeforeJourneyEntry();addJourneyEntry()};
removeEventListener('hashchange',renderBeforeJourneyEntry);addEventListener('hashchange',render);render();
