(() => {
  const installed = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  let pending = null;
  document.body.insertAdjacentHTML('beforeend', `<button type="button" class="desktop-entry" id="desktop-entry" aria-haspopup="dialog">添加到桌面</button>
  <dialog class="desktop-guide" id="desktop-guide" aria-labelledby="desktop-title"><form method="dialog"><button class="desktop-close" aria-label="关闭添加说明">×</button></form><h2 id="desktop-title">把游戏放到桌面</h2><p id="desktop-status"></p><button type="button" id="desktop-install" hidden>安装游戏</button><section><h3>iPhone / iPad</h3><p>在 Safari 中打开本页，点“分享”，选择“添加到主屏幕”，再点“添加”。如有“作为网页 App 打开”选项，可将它开启。</p><h3>安卓手机</h3><p>用 Chrome 或 Edge 打开本页。若出现安装按钮，点按钮继续；否则在浏览器菜单中查找“安装应用”或“添加到主屏幕”。</p><h3>电脑</h3><p>用 Chrome 或 Edge 打开游戏，点击地址栏里的安装图标，或在浏览器菜单中查找“安装此网站为应用”。</p></section><p class="desktop-note">微信或小红书内打不开安装菜单时，请先选择“在浏览器打开”。添加后仍需联网；进度保存在当前浏览器，清理浏览器数据可能清除进度。此入口不会自动修改你的桌面。</p></dialog>`);
  const entry = document.getElementById('desktop-entry');
  const dialog = document.getElementById('desktop-guide');
  const install = document.getElementById('desktop-install');
  const status = document.getElementById('desktop-status');
  function sync() {
    entry.textContent = installed() ? '桌面使用说明' : '添加到桌面';
    install.hidden = !pending || installed();
    status.textContent = installed() ? '当前已在独立窗口中打开游戏。' : pending ? '当前浏览器支持安装，可点击下方按钮继续。' : '按下面与你设备对应的步骤操作；浏览器是否提供安装由设备与浏览器决定。';
  }
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); pending = event; sync(); });
  window.addEventListener('appinstalled', () => { pending = null; sync(); if(dialog.open) dialog.close(); });
  entry.addEventListener('click', () => { sync(); if(!dialog.open) dialog.showModal(); });
  dialog.addEventListener('click', event => { if(event.target === dialog) { const box=dialog.getBoundingClientRect(); if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); } });
  install.addEventListener('click', async () => {
    if(!pending) return;
    const request = pending; pending = null; install.disabled = true;
    try { await request.prompt(); const choice = await request.userChoice; status.textContent = choice.outcome === 'accepted' ? '已接受安装，请完成浏览器的后续步骤。' : '已取消安装，可以继续游玩，或稍后从浏览器菜单添加。'; }
    catch { status.textContent = '暂未完成安装，请使用浏览器菜单，或参考下方说明。'; }
    finally { install.hidden = true; install.disabled = false; }
  });
  sync();
})();
