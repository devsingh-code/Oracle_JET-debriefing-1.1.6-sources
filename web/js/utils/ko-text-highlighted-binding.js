"use strict";define(["knockout"],t=>{let i={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"},e=t=>String(t).replace(/[&<>"'`=\/]/g,t=>i[t]),s=(t,i,s)=>{let n,r=-1;if(null!==s&&void 0!==s&&null!==i&&void 0!==i){n="string"==typeof s?s.toLowerCase().trim():s.toString().toLowerCase().trim();let t="string"==typeof i?i.toLowerCase():i.toString().toLowerCase();t.length>=n.length&&(r=t.indexOf(n))}if(r>=0){let s="string"==typeof i?i:i.toString(),o=n.length,l="";l+=e(s.substr(0,r)),l+='<span class="highlight">',l+=e(s.substr(r,o)),l+="</span>",l+=e(s.substring(r+o)),t.innerHTML=l}else t.innerText=i};t.bindingHandlers.textHighlighted={init:function(i,e,s,n,r){i.__textHighlitedSubscriptions=[],t.utils.domNodeDisposal.addDisposeCallback(i,()=>{i.__textHighlitedSubscriptions.forEach(t=>t.dispose())})},update:function(i,e,n,r,o){let l=e(),g=n.get("searchString");t.isObservable(l)&&i.__textHighlitedSubscriptions.push(l.subscribe(e=>{s(i,e,t.unwrap(g))})),t.isObservable(g)&&i.__textHighlitedSubscriptions.push(g.subscribe(e=>{s(i,t.unwrap(l),e)})),s(i,t.unwrap(l),t.unwrap(g))}}});