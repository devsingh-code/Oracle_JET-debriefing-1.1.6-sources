define(["jquery"],function(e){var t=function(t){var n=!0;if(!t)throw new Error("Cannot find canvas element");if(!t.getContext)throw new Error("Canvas' getContext method isn't supported");var o=t.getContext("2d");if(!o)throw new Error("Failed to get canvas' 2d context");t.style.position="relative";t.width=450,t.height=300,o.fillStyle="#fff",o.strokeStyle="#444",o.lineWidth=1.5,o.lineCap="round",o.fillRect(0,0,t.width,t.height),t.setAttribute("data-blank",t.toDataURL());var r="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch||!1,i=[],d={},u={},v=!1,a=0,s=0,c=window.PointerEvent,l=!0,f=null,m=function(e,t){t.x=e.offsetX,t.y=e.offsetY},h=function(e,t){t.x=e.clientX-a,t.y=e.clientY-s},p=function(e,t){t.x=e.pageX-a,t.y=e.pageY-s},y=function e(n){var o={x:null,y:null};if(void 0===e.resolve&&(void 0!==n.offsetX&&void 0!==n.offsetY?e.resolve=m:void 0!==n.clientX&&void 0!==n.clientY?e.resolve=h:void 0!==n.pageX&&void 0!==n.pageY&&(e.resolve=p)),e.resolve(n,o),!o.x&&0!=o.x||!o.y&&0!=o.y)return!1;var r=t.offsetWidth/t.width;return 0!=r&&(o.x/=r,o.y/=r),o},E=function(e){var n={x:null,y:null};if(e.changedTouches&&e.changedTouches[0]&&p(e.changedTouches[0],n),!n.x&&0!=n.x||!n.y&&0!=n.y)return!1;var o=t.offsetWidth/t.width;return 0!=o&&(n.x/=o,n.y/=o),n},L=function(e){var n={x:null,y:null};if("pen"==e.pointerType||"touch"==e.pointerType){if(void 0===L.resolve&&void 0!==e.pageX&&void 0!==e.pageY&&(L.resolve=p),L.resolve(e,n),!n.x&&0!=n.x||!n.y&&0!=n.y)return!1;var o=t.offsetWidth/t.width;return 0!=o&&(n.x/=o,n.y/=o),n}};if(r){var x=P.bind(null,E),g=R.bind(null,E),w=S;if(c)var b=P.bind(null,L),T=R.bind(null,L),C=S}else var D=P.bind(null,y),X=R.bind(null,y),Y=S;function P(r,u){u.preventDefault(),u.stopPropagation();var v=e(t).offset();a=v.left,s=v.top,t.addEventListener("mousemove",X,!1),t.addEventListener("mouseup",Y,!1),t.addEventListener("touchmove",g,!1),t.addEventListener("touchend",w,!1),t.addEventListener("touchcancel",w,!1),document.body.addEventListener("mouseup",Y,!1),document.body.addEventListener("touchend",w,!1),document.body.addEventListener("touchcancel",w),t.addEventListener("pointermove",T,!1),t.addEventListener("pointercancel",C,!1),t.addEventListener("pointerup",C,!1),document.body.addEventListener("pointerup",C,!1),document.body.addEventListener("pointermove",T,!1),document.body.addEventListener("pointerenter",T,!1),n=!1;var c=r(u);c&&(o.beginPath(),i.push("moveStart"),o.moveTo(c.x,c.y),i.push(c.x,c.y),d=c)}function R(e,t,n){t.preventDefault(),t.stopPropagation();var r=e(t);if(r){var a={x:(d.x+r.x)/2,y:(d.y+r.y)/2};if(v){var s=(u.x+d.x+a.x)/3,c=(u.y+d.y+a.y)/3;i.push(s,c)}else v=!0;o.quadraticCurveTo(d.x,d.y,a.x,a.y),i.push(a.x,a.y),o.stroke(),o.beginPath(),o.moveTo(a.x,a.y),u=a,d=r}}function S(e){t.removeEventListener("mousemove",X),t.removeEventListener("mouseup",Y),t.removeEventListener("touchmove",g),t.removeEventListener("touchend",w),t.removeEventListener("touchcancel",w),document.body.removeEventListener("mouseup",Y),document.body.removeEventListener("touchend",w),document.body.removeEventListener("touchcancel",w),t.removeEventListener("pointermove",T),t.removeEventListener("pointercancel",C),t.removeEventListener("pointerup",C),document.body.removeEventListener("pointerup",C),document.body.removeEventListener("pointermove",T),document.body.removeEventListener("pointerenter",T),o.stroke(),i.push("e"),v=!1,l=!0,f=null}return t.addEventListener("mousedown",D,!1),t.addEventListener("touchstart",x,!1),t.addEventListener("pointerdown",b,!1),{clear:function(){o.clearRect(0,0,t.offsetWidth,t.offsetHeight),o.fillRect(0,0,t.width,t.height),i=[],n=!0,l=!0,f=null},getDataString:function(){return l&&(f=t.toDataURL(),l=!1),f},getPixels:function(){return i.join(", ")},isEmpty:function(){return n},resetEmpty:function(e){n=!!e}}};return window?window.signature=t:window.MobileSignature=t,t});