import{aN as U,p as h,g as k,a4 as He,aG as je,ap as fe,a0 as X,aw as Fe,aO as Ue,J as x,h as d,aB as I,aK as ge,aP as ae,aQ as Me,aR as Xe,aS as qe,c as u,F as he,K as se,aT as Ye,e as Ke,U as g,I as ye,a as J,j as Q,b as Z,aU as Ge,t as pe,aV as Je,aW as Qe,s as $,aX as ee,M as be,P as F,k as Se,f as Ze,T as _e,aY as et,aZ as re,d as tt,$ as Ce,x as we,A as nt,a_ as at,a$ as ie,m as ke,L as st,w as oe,r as rt,v as it}from"./entry.CkaK160t.js";const xe=["top","bottom"],ot=["start","end","left","right"];function lt(e,t){let[n,a]=e.split(" ");return a||(a=U(xe,n)?"start":U(ot,n)?"top":"center"),{side:le(n,t),align:le(a,t)}}function le(e,t){return e==="start"?t?"right":"left":e==="end"?t?"left":"right":e}function Ut(e){return{side:{center:"center",top:"bottom",bottom:"top",left:"right",right:"left"}[e.side],align:e.align}}function Mt(e){return{side:e.side,align:{center:"center",top:"bottom",bottom:"top",left:"right",right:"left"}[e.align]}}function Xt(e){return{side:e.align,align:e.side}}function qt(e){return U(xe,e.side)?"y":"x"}const E=h({class:[String,Array],style:{type:[String,Array,Object],default:null}},"component");function Yt(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"div",n=arguments.length>2?arguments[2]:void 0;return k()({name:n??He(je(e.replace(/__/g,"-"))),props:{tag:{type:String,default:t},...E()},setup(a,r){let{slots:s}=r;return()=>{var i;return fe(a.tag,{class:[e,a.class],style:a.style},(i=s.default)==null?void 0:i.call(s))}}})}function D(e){const t=X("useRender");t.render=e}const ut=Fe("core",{state:()=>({isLoading:!1,snackbar:{active:!1,text:"",color:""}}),actions:{setLoading(e){this.isLoading=e},setSnackBar(e){console.log(e),this.snackbar=e}}});async function Kt(e){const n=Ue().public.apiBaseUrl,a=ut();try{return a.setLoading(!0),await $fetch(`${n}/${e}`)}catch(r){console.log(r),a.setSnackBar({active:!0,text:`Errore durante il fetch dei dati: ${e}`,color:"red"})}finally{setTimeout(()=>{a.setLoading(!1)},1e3)}}const Gt=h({border:[Boolean,Number,String]},"border");function Jt(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();return{borderClasses:d(()=>{const a=I(e)?e.value:e.border,r=[];if(a===!0||a==="")r.push(`${t}--border`);else if(typeof a=="string"||a===0)for(const s of String(a).split(" "))r.push(`border-${s}`);return r})}}const ct=[null,"default","comfortable","compact"],dt=h({density:{type:String,default:"default",validator:e=>ct.includes(e)}},"density");function vt(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();return{densityClasses:d(()=>`${t}--density-${e.density}`)}}const Qt=h({elevation:{type:[Number,String],validator(e){const t=parseInt(e);return!isNaN(t)&&t>=0&&t<=24}}},"elevation");function Zt(e){return{elevationClasses:d(()=>{const n=I(e)?e.value:e.elevation,a=[];return n==null||a.push(`elevation-${n}`),a})}}const Te=h({rounded:{type:[Boolean,Number,String],default:void 0}},"rounded");function Le(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();return{roundedClasses:d(()=>{const a=I(e)?e.value:e.rounded,r=[];if(a===!0||a==="")r.push(`${t}--rounded`);else if(typeof a=="string"||a===0)for(const s of String(a).split(" "))r.push(`rounded-${s}`);return r})}}const te=h({tag:{type:String,default:"div"}},"tag");function ne(e){return ge(()=>{const t=[],n={};if(e.value.background)if(ae(e.value.background)){if(n.backgroundColor=e.value.background,!e.value.text&&Me(e.value.background)){const a=Xe(e.value.background);if(a.a==null||a.a===1){const r=qe(a);n.color=r,n.caretColor=r}}}else t.push(`bg-${e.value.background}`);return e.value.text&&(ae(e.value.text)?(n.color=e.value.text,n.caretColor=e.value.text):t.push(`text-${e.value.text}`)),{colorClasses:t,colorStyles:n}})}function Pe(e,t){const n=d(()=>({text:I(e)?e.value:t?e[t]:null})),{colorClasses:a,colorStyles:r}=ne(n);return{textColorClasses:a,textColorStyles:r}}function ue(e,t){const n=d(()=>({background:I(e)?e.value:t?e[t]:null})),{colorClasses:a,colorStyles:r}=ne(n);return{backgroundColorClasses:a,backgroundColorStyles:r}}const mt=["elevated","flat","tonal","outlined","text","plain"];function ft(e,t){return u(he,null,[e&&u("span",{key:"overlay",class:`${t}__overlay`},null),u("span",{key:"underlay",class:`${t}__underlay`},null)])}const gt=h({color:String,variant:{type:String,default:"elevated",validator:e=>mt.includes(e)}},"variant");function ht(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();const n=d(()=>{const{variant:s}=se(e);return`${t}--variant-${s}`}),{colorClasses:a,colorStyles:r}=ne(d(()=>{const{variant:s,color:i}=se(e);return{[["elevated","flat"].includes(s)?"background":"text"]:i}}));return{colorClasses:a,colorStyles:r,variantClasses:n}}const yt=h({defaults:Object,disabled:Boolean,reset:[Number,String],root:[Boolean,String],scoped:Boolean},"VDefaultsProvider"),en=k(!1)({name:"VDefaultsProvider",props:yt(),setup(e,t){let{slots:n}=t;const{defaults:a,disabled:r,reset:s,root:i,scoped:o}=Ye(e);return Ke(a,{reset:s,root:i,scoped:o,disabled:r}),()=>{var l;return(l=n.default)==null?void 0:l.call(n)}}}),pt=["x-small","small","default","large","x-large"],$e=h({size:{type:[String,Number],default:"default"}},"size");function Ee(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();return ge(()=>{let n,a;return U(pt,e.size)?n=`${t}--size-${e.size}`:e.size&&(a={width:g(e.size),height:g(e.size)}),{sizeClasses:n,sizeStyles:a}})}const bt=h({color:String,start:Boolean,end:Boolean,icon:ye,...E(),...$e(),...te({tag:"i"}),...J()},"VIcon"),St=k()({name:"VIcon",props:bt(),setup(e,t){let{attrs:n,slots:a}=t;const r=Q(),{themeClasses:s}=Z(e),{iconData:i}=Ge(d(()=>r.value||e.icon)),{sizeClasses:o}=Ee(e),{textColorClasses:l,textColorStyles:m}=Pe(pe(e,"color"));return D(()=>{var f,y;const v=(f=a.default)==null?void 0:f.call(a);return v&&(r.value=(y=Je(v).filter(b=>b.type===Qe&&b.children&&typeof b.children=="string")[0])==null?void 0:y.children),u(i.value.component,{tag:e.tag,icon:i.value.icon,class:["v-icon","notranslate",s.value,o.value,l.value,{"v-icon--clickable":!!n.onClick,"v-icon--start":e.start,"v-icon--end":e.end},e.class],style:[o.value?void 0:{fontSize:g(e.size),height:g(e.size),width:g(e.size)},m.value,e.style],role:n.onClick?"button":void 0,"aria-hidden":!n.onClick},{default:()=>[v]})}),{}}});function _t(e,t){const n=Q(),a=$(!1);if(ee){const r=new IntersectionObserver(s=>{e==null||e(s,r),a.value=!!s.find(i=>i.isIntersecting)},t);be(()=>{r.disconnect()}),F(n,(s,i)=>{i&&(r.unobserve(i),a.value=!1),s&&r.observe(s)},{flush:"post"})}return{intersectionRef:n,isIntersecting:a}}const Ct=h({height:[Number,String],maxHeight:[Number,String],maxWidth:[Number,String],minHeight:[Number,String],minWidth:[Number,String],width:[Number,String]},"dimension");function wt(e){return{dimensionStyles:d(()=>({height:g(e.height),maxHeight:g(e.maxHeight),maxWidth:g(e.maxWidth),minHeight:g(e.minHeight),minWidth:g(e.minWidth),width:g(e.width)}))}}const ce={center:"center",top:"bottom",bottom:"top",left:"right",right:"left"},kt=h({location:String},"location");function xt(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,n=arguments.length>2?arguments[2]:void 0;const{isRtl:a}=Se();return{locationStyles:d(()=>{if(!e.location)return{};const{side:s,align:i}=lt(e.location.split(" ").length>1?e.location:`${e.location} center`,a.value);function o(m){return n?n(m):0}const l={};return s!=="center"&&(t?l[ce[s]]=`calc(100% - ${o(s)}px)`:l[s]=0),i!=="center"?t?l[ce[i]]=`calc(100% - ${o(i)}px)`:l[i]=0:(s==="center"?l.top=l.left="50%":l[{top:"left",bottom:"left",left:"top",right:"top"}[s]]="50%",l.transform={top:"translateX(-50%)",bottom:"translateX(-50%)",left:"translateY(-50%)",right:"translateY(-50%)",center:"translate(-50%, -50%)"}[s]),l})}}const Tt=h({absolute:Boolean,active:{type:Boolean,default:!0},bgColor:String,bgOpacity:[Number,String],bufferValue:{type:[Number,String],default:0},clickable:Boolean,color:String,height:{type:[Number,String],default:4},indeterminate:Boolean,max:{type:[Number,String],default:100},modelValue:{type:[Number,String],default:0},reverse:Boolean,stream:Boolean,striped:Boolean,roundedBar:Boolean,...E(),...kt({location:"top"}),...Te(),...te(),...J()},"VProgressLinear"),Lt=k()({name:"VProgressLinear",props:Tt(),emits:{"update:modelValue":e=>!0},setup(e,t){let{slots:n}=t;const a=Ze(e,"modelValue"),{isRtl:r,rtlClasses:s}=Se(),{themeClasses:i}=Z(e),{locationStyles:o}=xt(e),{textColorClasses:l,textColorStyles:m}=Pe(e,"color"),{backgroundColorClasses:v,backgroundColorStyles:f}=ue(d(()=>e.bgColor||e.color)),{backgroundColorClasses:y,backgroundColorStyles:b}=ue(e,"color"),{roundedClasses:O}=Le(e),{intersectionRef:T,isIntersecting:R}=_t(),C=d(()=>parseInt(e.max,10)),w=d(()=>parseInt(e.height,10)),B=d(()=>parseFloat(e.bufferValue)/C.value*100),z=d(()=>parseFloat(a.value)/C.value*100),L=d(()=>r.value!==e.reverse),q=d(()=>e.indeterminate?"fade-transition":"slide-x-transition"),A=d(()=>e.bgOpacity==null?e.bgOpacity:parseFloat(e.bgOpacity));function W(c){if(!T.value)return;const{left:p,right:_,width:P}=T.value.getBoundingClientRect(),H=L.value?P-c.clientX+(_-P):c.clientX-p;a.value=Math.round(H/P*C.value)}return D(()=>u(e.tag,{ref:T,class:["v-progress-linear",{"v-progress-linear--absolute":e.absolute,"v-progress-linear--active":e.active&&R.value,"v-progress-linear--reverse":L.value,"v-progress-linear--rounded":e.rounded,"v-progress-linear--rounded-bar":e.roundedBar,"v-progress-linear--striped":e.striped},O.value,i.value,s.value,e.class],style:[{bottom:e.location==="bottom"?0:void 0,top:e.location==="top"?0:void 0,height:e.active?g(w.value):0,"--v-progress-linear-height":g(w.value),...o.value},e.style],role:"progressbar","aria-hidden":e.active?"false":"true","aria-valuemin":"0","aria-valuemax":e.max,"aria-valuenow":e.indeterminate?void 0:z.value,onClick:e.clickable&&W},{default:()=>[e.stream&&u("div",{key:"stream",class:["v-progress-linear__stream",l.value],style:{...m.value,[L.value?"left":"right"]:g(-w.value),borderTop:`${g(w.value/2)} dotted`,opacity:A.value,top:`calc(50% - ${g(w.value/4)})`,width:g(100-B.value,"%"),"--v-progress-linear-stream-to":g(w.value*(L.value?1:-1))}},null),u("div",{class:["v-progress-linear__background",v.value],style:[f.value,{opacity:A.value,width:g(e.stream?B.value:100,"%")}]},null),u(_e,{name:q.value},{default:()=>[e.indeterminate?u("div",{class:"v-progress-linear__indeterminate"},[["long","short"].map(c=>u("div",{key:c,class:["v-progress-linear__indeterminate",c,y.value],style:b.value},null))]):u("div",{class:["v-progress-linear__determinate",y.value],style:[b.value,{width:g(z.value,"%")}]},null)]}),n.default&&u("div",{class:"v-progress-linear__content"},[n.default({value:z.value,buffer:B.value})])]})),{}}}),tn=h({loading:[Boolean,String]},"loader");function nn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();return{loaderClasses:d(()=>({[`${t}--loading`]:e.loading}))}}function an(e,t){var a;let{slots:n}=t;return u("div",{class:`${e.name}__loader`},[((a=n.default)==null?void 0:a.call(n,{color:e.color,isActive:e.active}))||u(Lt,{absolute:e.absolute,active:e.active,color:e.color,height:"2",indeterminate:!0},null)])}const Pt=["static","relative","fixed","absolute","sticky"],sn=h({position:{type:String,validator:e=>Pt.includes(e)}},"position");function rn(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:x();return{positionClasses:d(()=>e.position?`${t}--${e.position}`:void 0)}}function $t(){const e=X("useRoute");return d(()=>{var t;return(t=e==null?void 0:e.proxy)==null?void 0:t.$route})}function on(){var e,t;return(t=(e=X("useRouter"))==null?void 0:e.proxy)==null?void 0:t.$router}function ln(e,t){const n=et("RouterLink"),a=d(()=>!!(e.href||e.to)),r=d(()=>(a==null?void 0:a.value)||re(t,"click")||re(e,"click"));if(typeof n=="string")return{isLink:a,isClickable:r,href:pe(e,"href")};const s=e.to?n.useLink(e):void 0,i=$t();return{isLink:a,isClickable:r,route:s==null?void 0:s.route,navigate:s==null?void 0:s.navigate,isActive:s&&d(()=>{var o,l,m;return e.exact?i.value?((m=s.isExactActive)==null?void 0:m.value)&&tt(s.route.value.query,i.value.query):(l=s.isExactActive)==null?void 0:l.value:(o=s.isActive)==null?void 0:o.value}),href:d(()=>e.to?s==null?void 0:s.route.value.href:e.href)}}const un=h({href:String,replace:Boolean,to:[String,Object],exact:Boolean},"router");let Y=!1;function cn(e,t){let n=!1,a,r;Ce&&(we(()=>{window.addEventListener("popstate",s),a=e==null?void 0:e.beforeEach((i,o,l)=>{Y?n?t(l):l():setTimeout(()=>n?t(l):l()),Y=!0}),r=e==null?void 0:e.afterEach(()=>{Y=!1})}),nt(()=>{window.removeEventListener("popstate",s),a==null||a(),r==null||r()}));function s(i){var o;(o=i.state)!=null&&o.replaced||(n=!0,setTimeout(()=>n=!1))}}const K=Symbol("rippleStop"),Et=80;function de(e,t){e.style.transform=t,e.style.webkitTransform=t}function G(e){return e.constructor.name==="TouchEvent"}function Re(e){return e.constructor.name==="KeyboardEvent"}const Rt=function(e,t){var f;let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},a=0,r=0;if(!Re(e)){const y=t.getBoundingClientRect(),b=G(e)?e.touches[e.touches.length-1]:e;a=b.clientX-y.left,r=b.clientY-y.top}let s=0,i=.3;(f=t._ripple)!=null&&f.circle?(i=.15,s=t.clientWidth/2,s=n.center?s:s+Math.sqrt((a-s)**2+(r-s)**2)/4):s=Math.sqrt(t.clientWidth**2+t.clientHeight**2)/2;const o=`${(t.clientWidth-s*2)/2}px`,l=`${(t.clientHeight-s*2)/2}px`,m=n.center?o:`${a-s}px`,v=n.center?l:`${r-s}px`;return{radius:s,scale:i,x:m,y:v,centerX:o,centerY:l}},M={show(e,t){var b;let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};if(!((b=t==null?void 0:t._ripple)!=null&&b.enabled))return;const a=document.createElement("span"),r=document.createElement("span");a.appendChild(r),a.className="v-ripple__container",n.class&&(a.className+=` ${n.class}`);const{radius:s,scale:i,x:o,y:l,centerX:m,centerY:v}=Rt(e,t,n),f=`${s*2}px`;r.className="v-ripple__animation",r.style.width=f,r.style.height=f,t.appendChild(a);const y=window.getComputedStyle(t);y&&y.position==="static"&&(t.style.position="relative",t.dataset.previousPosition="static"),r.classList.add("v-ripple__animation--enter"),r.classList.add("v-ripple__animation--visible"),de(r,`translate(${o}, ${l}) scale3d(${i},${i},${i})`),r.dataset.activated=String(performance.now()),setTimeout(()=>{r.classList.remove("v-ripple__animation--enter"),r.classList.add("v-ripple__animation--in"),de(r,`translate(${m}, ${v}) scale3d(1,1,1)`)},0)},hide(e){var s;if(!((s=e==null?void 0:e._ripple)!=null&&s.enabled))return;const t=e.getElementsByClassName("v-ripple__animation");if(t.length===0)return;const n=t[t.length-1];if(n.dataset.isHiding)return;n.dataset.isHiding="true";const a=performance.now()-Number(n.dataset.activated),r=Math.max(250-a,0);setTimeout(()=>{n.classList.remove("v-ripple__animation--in"),n.classList.add("v-ripple__animation--out"),setTimeout(()=>{var o;e.getElementsByClassName("v-ripple__animation").length===1&&e.dataset.previousPosition&&(e.style.position=e.dataset.previousPosition,delete e.dataset.previousPosition),((o=n.parentNode)==null?void 0:o.parentNode)===e&&e.removeChild(n.parentNode)},300)},r)}};function Be(e){return typeof e>"u"||!!e}function N(e){const t={},n=e.currentTarget;if(!(!(n!=null&&n._ripple)||n._ripple.touched||e[K])){if(e[K]=!0,G(e))n._ripple.touched=!0,n._ripple.isTouch=!0;else if(n._ripple.isTouch)return;if(t.center=n._ripple.centered||Re(e),n._ripple.class&&(t.class=n._ripple.class),G(e)){if(n._ripple.showTimerCommit)return;n._ripple.showTimerCommit=()=>{M.show(e,n,t)},n._ripple.showTimer=window.setTimeout(()=>{var a;(a=n==null?void 0:n._ripple)!=null&&a.showTimerCommit&&(n._ripple.showTimerCommit(),n._ripple.showTimerCommit=null)},Et)}else M.show(e,n,t)}}function ve(e){e[K]=!0}function S(e){const t=e.currentTarget;if(t!=null&&t._ripple){if(window.clearTimeout(t._ripple.showTimer),e.type==="touchend"&&t._ripple.showTimerCommit){t._ripple.showTimerCommit(),t._ripple.showTimerCommit=null,t._ripple.showTimer=window.setTimeout(()=>{S(e)});return}window.setTimeout(()=>{t._ripple&&(t._ripple.touched=!1)}),M.hide(t)}}function ze(e){const t=e.currentTarget;t!=null&&t._ripple&&(t._ripple.showTimerCommit&&(t._ripple.showTimerCommit=null),window.clearTimeout(t._ripple.showTimer))}let V=!1;function Ne(e){!V&&(e.keyCode===ie.enter||e.keyCode===ie.space)&&(V=!0,N(e))}function Ve(e){V=!1,S(e)}function Ie(e){V&&(V=!1,S(e))}function De(e,t,n){const{value:a,modifiers:r}=t,s=Be(a);if(s||M.hide(e),e._ripple=e._ripple??{},e._ripple.enabled=s,e._ripple.centered=r.center,e._ripple.circle=r.circle,at(a)&&a.class&&(e._ripple.class=a.class),s&&!n){if(r.stop){e.addEventListener("touchstart",ve,{passive:!0}),e.addEventListener("mousedown",ve);return}e.addEventListener("touchstart",N,{passive:!0}),e.addEventListener("touchend",S,{passive:!0}),e.addEventListener("touchmove",ze,{passive:!0}),e.addEventListener("touchcancel",S),e.addEventListener("mousedown",N),e.addEventListener("mouseup",S),e.addEventListener("mouseleave",S),e.addEventListener("keydown",Ne),e.addEventListener("keyup",Ve),e.addEventListener("blur",Ie),e.addEventListener("dragstart",S,{passive:!0})}else!s&&n&&Oe(e)}function Oe(e){e.removeEventListener("mousedown",N),e.removeEventListener("touchstart",N),e.removeEventListener("touchend",S),e.removeEventListener("touchmove",ze),e.removeEventListener("touchcancel",S),e.removeEventListener("mouseup",S),e.removeEventListener("mouseleave",S),e.removeEventListener("keydown",Ne),e.removeEventListener("keyup",Ve),e.removeEventListener("dragstart",S),e.removeEventListener("blur",Ie)}function Bt(e,t){De(e,t,!1)}function zt(e){delete e._ripple,Oe(e)}function Nt(e,t){if(t.value===t.oldValue)return;const n=Be(t.oldValue);De(e,t,n)}const dn={mounted:Bt,unmounted:zt,updated:Nt};function Vt(e){return{aspectStyles:d(()=>{const t=Number(e.aspectRatio);return t?{paddingBottom:String(1/t*100)+"%"}:void 0})}}const Ae=h({aspectRatio:[String,Number],contentClass:String,inline:Boolean,...E(),...Ct()},"VResponsive"),me=k()({name:"VResponsive",props:Ae(),setup(e,t){let{slots:n}=t;const{aspectStyles:a}=Vt(e),{dimensionStyles:r}=wt(e);return D(()=>{var s;return u("div",{class:["v-responsive",{"v-responsive--inline":e.inline},e.class],style:[r.value,e.style]},[u("div",{class:"v-responsive__sizer",style:a.value},null),(s=n.additional)==null?void 0:s.call(n),n.default&&u("div",{class:["v-responsive__content",e.contentClass]},[n.default()])])}),{}}}),It=h({transition:{type:[Boolean,String,Object],default:"fade-transition",validator:e=>e!==!0}},"transition"),j=(e,t)=>{let{slots:n}=t;const{transition:a,disabled:r,...s}=e,{component:i=_e,...o}=typeof a=="object"?a:{};return fe(i,ke(typeof a=="string"?{name:r?"":a}:o,s,{disabled:r}),n)};function Dt(e,t){if(!ee)return;const n=t.modifiers||{},a=t.value,{handler:r,options:s}=typeof a=="object"?a:{handler:a,options:{}},i=new IntersectionObserver(function(){var f;let o=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],l=arguments.length>1?arguments[1]:void 0;const m=(f=e._observe)==null?void 0:f[t.instance.$.uid];if(!m)return;const v=o.some(y=>y.isIntersecting);r&&(!n.quiet||m.init)&&(!n.once||v||m.init)&&r(v,o,l),v&&n.once?We(e,t):m.init=!0},s);e._observe=Object(e._observe),e._observe[t.instance.$.uid]={init:!1,observer:i},i.observe(e)}function We(e,t){var a;const n=(a=e._observe)==null?void 0:a[t.instance.$.uid];n&&(n.observer.unobserve(e),delete e._observe[t.instance.$.uid])}const Ot={mounted:Dt,unmounted:We},At=Ot,Wt=h({alt:String,cover:Boolean,draggable:{type:[Boolean,String],default:void 0},eager:Boolean,gradient:String,lazySrc:String,options:{type:Object,default:()=>({root:void 0,rootMargin:void 0,threshold:void 0})},sizes:String,src:{type:[String,Object],default:""},crossorigin:String,referrerpolicy:String,srcset:String,position:String,...Ae(),...E(),...It()},"VImg"),Ht=k()({name:"VImg",directives:{intersect:At},props:Wt(),emits:{loadstart:e=>!0,load:e=>!0,error:e=>!0},setup(e,t){let{emit:n,slots:a}=t;const r=X("VImg"),s=$(""),i=Q(),o=$(e.eager?"loading":"idle"),l=$(),m=$(),v=d(()=>e.src&&typeof e.src=="object"?{src:e.src.src,srcset:e.srcset||e.src.srcset,lazySrc:e.lazySrc||e.src.lazySrc,aspect:Number(e.aspectRatio||e.src.aspect||0)}:{src:e.src,srcset:e.srcset,lazySrc:e.lazySrc,aspect:Number(e.aspectRatio||0)}),f=d(()=>v.value.aspect||l.value/m.value||0);F(()=>e.src,()=>{y(o.value!=="idle")}),F(f,(c,p)=>{!c&&p&&i.value&&C(i.value)}),st(()=>y());function y(c){if(!(e.eager&&c)&&!(ee&&!c&&!e.eager)){if(o.value="loading",v.value.lazySrc){const p=new Image;p.src=v.value.lazySrc,C(p,null)}v.value.src&&we(()=>{var p;n("loadstart",((p=i.value)==null?void 0:p.currentSrc)||v.value.src),setTimeout(()=>{var _;if(!r.isUnmounted)if((_=i.value)!=null&&_.complete){if(i.value.naturalWidth||O(),o.value==="error")return;f.value||C(i.value,null),o.value==="loading"&&b()}else f.value||C(i.value),T()})})}}function b(){var c;r.isUnmounted||(T(),C(i.value),o.value="loaded",n("load",((c=i.value)==null?void 0:c.currentSrc)||v.value.src))}function O(){var c;r.isUnmounted||(o.value="error",n("error",((c=i.value)==null?void 0:c.currentSrc)||v.value.src))}function T(){const c=i.value;c&&(s.value=c.currentSrc||c.src)}let R=-1;be(()=>{clearTimeout(R)});function C(c){let p=arguments.length>1&&arguments[1]!==void 0?arguments[1]:100;const _=()=>{if(clearTimeout(R),r.isUnmounted)return;const{naturalHeight:P,naturalWidth:H}=c;P||H?(l.value=H,m.value=P):!c.complete&&o.value==="loading"&&p!=null?R=window.setTimeout(_,p):(c.currentSrc.endsWith(".svg")||c.currentSrc.startsWith("data:image/svg+xml"))&&(l.value=1,m.value=1)};_()}const w=d(()=>({"v-img__img--cover":e.cover,"v-img__img--contain":!e.cover})),B=()=>{var _;if(!v.value.src||o.value==="idle")return null;const c=u("img",{class:["v-img__img",w.value],style:{objectPosition:e.position},src:v.value.src,srcset:v.value.srcset,alt:e.alt,crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy,draggable:e.draggable,sizes:e.sizes,ref:i,onLoad:b,onError:O},null),p=(_=a.sources)==null?void 0:_.call(a);return u(j,{transition:e.transition,appear:!0},{default:()=>[oe(p?u("picture",{class:"v-img__picture"},[p,c]):c,[[it,o.value==="loaded"]])]})},z=()=>u(j,{transition:e.transition},{default:()=>[v.value.lazySrc&&o.value!=="loaded"&&u("img",{class:["v-img__img","v-img__img--preload",w.value],style:{objectPosition:e.position},src:v.value.lazySrc,alt:e.alt,crossorigin:e.crossorigin,referrerpolicy:e.referrerpolicy,draggable:e.draggable},null)]}),L=()=>a.placeholder?u(j,{transition:e.transition,appear:!0},{default:()=>[(o.value==="loading"||o.value==="error"&&!a.error)&&u("div",{class:"v-img__placeholder"},[a.placeholder()])]}):null,q=()=>a.error?u(j,{transition:e.transition,appear:!0},{default:()=>[o.value==="error"&&u("div",{class:"v-img__error"},[a.error()])]}):null,A=()=>e.gradient?u("div",{class:"v-img__gradient",style:{backgroundImage:`linear-gradient(${e.gradient})`}},null):null,W=$(!1);{const c=F(f,p=>{p&&(requestAnimationFrame(()=>{requestAnimationFrame(()=>{W.value=!0})}),c())})}return D(()=>{const c=me.filterProps(e);return oe(u(me,ke({class:["v-img",{"v-img--booting":!W.value},e.class],style:[{width:g(e.width==="auto"?l.value:e.width)},e.style]},c,{aspectRatio:f.value,"aria-label":e.alt,role:e.alt?"img":void 0}),{additional:()=>u(he,null,[u(B,null,null),u(z,null,null),u(A,null,null),u(L,null,null),u(q,null,null)]),default:a.default}),[[rt("intersect"),{handler:y,options:e.options},null,{once:!0}]])}),{currentSrc:s,image:i,state:o,naturalWidth:l,naturalHeight:m}}}),jt=h({start:Boolean,end:Boolean,icon:ye,image:String,text:String,...E(),...dt(),...Te(),...$e(),...te(),...J(),...gt({variant:"flat"})},"VAvatar"),vn=k()({name:"VAvatar",props:jt(),setup(e,t){let{slots:n}=t;const{themeClasses:a}=Z(e),{colorClasses:r,colorStyles:s,variantClasses:i}=ht(e),{densityClasses:o}=vt(e),{roundedClasses:l}=Le(e),{sizeClasses:m,sizeStyles:v}=Ee(e);return D(()=>u(e.tag,{class:["v-avatar",{"v-avatar--start":e.start,"v-avatar--end":e.end},a.value,r.value,o.value,l.value,m.value,i.value,e.class],style:[s.value,v.value,e.style]},{default:()=>{var f;return[e.image?u(Ht,{key:"image",src:e.image,alt:"",cover:!0},null):e.icon?u(St,{key:"icon",icon:e.icon},null):((f=n.default)==null?void 0:f.call(n))??e.text,ft(!1,"v-avatar")]}})),{}}}),mn=h({closeDelay:[Number,String],openDelay:[Number,String]},"delay");function fn(e,t){const n={},a=r=>()=>{if(!Ce)return Promise.resolve(!0);const s=r==="openDelay";return n.closeDelay&&window.clearTimeout(n.closeDelay),delete n.closeDelay,n.openDelay&&window.clearTimeout(n.openDelay),delete n.openDelay,new Promise(i=>{const o=parseInt(e[r]??0,10);n[r]=window.setTimeout(()=>{t==null||t(s),i(s)},o)})};return{runCloseDelay:a("closeDelay"),runOpenDelay:a("openDelay")}}export{wt as A,Yt as B,Kt as C,Lt as D,mn as E,fn as F,kt as G,sn as H,At as I,xt as J,rn as K,an as L,j as M,Ht as N,ut as O,on as P,le as Q,dn as R,_t as S,lt as T,Ut as U,St as V,Mt as W,Xt as X,qt as Y,cn as Z,te as a,gt as b,Gt as c,dt as d,Qt as e,Te as f,un as g,$e as h,Jt as i,ht as j,vt as k,Zt as l,E as m,Le as n,Ee as o,ln as p,ft as q,en as r,vn as s,Pe as t,D as u,ue as v,It as w,tn as x,nn as y,Ct as z};