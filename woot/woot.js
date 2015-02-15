//(c) Joe Sortelli 2006
//
//Author: J. Sortelli
//Created: Wed Dec 27 16:25:33 CST 2006

document.write('<link href="woot/woot.css" rel="stylesheet" type="text/css">');

WootLogo.POSITION_X      = -20;
WootLogo.POSITION_Y      = 0;
WootLogo.EYE_OFFSET_X    = 20;
WootLogo.EYE_OFFSET_Y    = 22;
WootLogo.EYE_RADIUS      = 24;
WootLogo.UPDATE_INTERVAL = 2;

function WootEye(originX, originY) {
  this.originX = originX + WootLogo.EYE_OFFSET_X;
  this.originY = originY + WootLogo.EYE_OFFSET_Y;
  this.x       = 0;
  this.y       = 0;

  this.div = document.createElement('div');
  this.div.className = 'eye';

  this.div.style.left = this.x + this.originX - WootLogo.EYE_OFFSET_X + 'px';
  this.div.style.top  = this.y + this.originY - WootLogo.EYE_OFFSET_Y + 'px';
}

WootEye.prototype.update = function(x, y) {
  var deltaX = x - this.originX - this.div.parentNode.offsetLeft;
  var deltaY = y - this.originY - this.div.parentNode.offsetTop;
  var radius = WootLogo.EYE_RADIUS;
  var distance;

  distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  if (distance > WootLogo.EYE_RADIUS)
    distance = WootLogo.EYE_RADIUS;

  var signX = (deltaX < 0) ? -1 : 1;
  var signY = (deltaY < 0) ? -1 : 1;

  angle = Math.atan(deltaX / deltaY);

  this.x = signX * Math.abs(distance * Math.sin(angle)); 
  this.y = signY * Math.abs(distance * Math.cos(angle)); 

  this.div.style.left = this.x + this.originX - WootLogo.EYE_OFFSET_X + 'px';
  this.div.style.top  = this.y + this.originY - WootLogo.EYE_OFFSET_Y + 'px';

}

function WootLogo() {
  window.wootEye  = new WootEye(63, 53);

  var woot   = document.createElement('div');
  var eyeLid = document.createElement('div');

  woot.id          = 'WootLogo';
  eyeLid.className = 'eye_lid';

  woot.appendChild(eyeLid     );
  woot.appendChild(wootEye.div);

  document.body.appendChild(woot);

  var oldFunc = document.onmousemove;
  
  document.onmousemove = function(evt) {
    if (oldFunc)
      oldFunc(evt);

    WootLogoUpdate(evt) ;
  };
}

function WootLogoUpdate(evt) {
  if (WootLogoUpdate.tick++ == WootLogo.UPDATE_INTERVAL)
    WootLogoUpdate.tick = 0;
  else
    return;

  evt = (evt) ? evt : event;

  var mouseX, mouseY;

  if (evt.clientX && evt.clientY) {
    mouseX = evt.clientX + parseInt(document.body.parentNode.scrollLeft, 10);
    mouseY = evt.clientY + parseInt(document.body.parentNode.scrollTop,  10);
  } 
  else if (evt.pageX && evt.pageY) {
    mouseX = evt.pageX;
    mouseY = evt.pageY;
  }
  else
    return;

  wootEye.update(mouseX, mouseY);
}

WootLogoUpdate.tick = 0;
