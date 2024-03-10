import{m as M,u as B}from"./VContainer.TqakeagM.js";import{m as C,a as V}from"./VImg.9o4r4YwH.js";import{aV as i,aJ as c,P as f,N as d,c as S,g as k,Z as G}from"./entry.oi8mDLPx.js";const N=i.reduce((e,a)=>(e[a]={type:[Boolean,String,Number],default:!1},e),{}),j=i.reduce((e,a)=>{const t="offset"+c(a);return e[t]={type:[String,Number],default:null},e},{}),P=i.reduce((e,a)=>{const t="order"+c(a);return e[t]={type:[String,Number],default:null},e},{}),b={col:Object.keys(N),offset:Object.keys(j),order:Object.keys(P)};function H(e,a,t){let l=e;if(!(t==null||t===!1)){if(a){const n=a.replace(e,"");l+=`-${n}`}return e==="col"&&(l="v-"+l),e==="col"&&(t===""||t===!0)||(l+=`-${t}`),l.toLowerCase()}}const _=["auto","start","end","center","baseline","stretch"],p=f({cols:{type:[Boolean,String,Number],default:!1},...N,offset:{type:[String,Number],default:null},...j,order:{type:[String,Number],default:null},...P,alignSelf:{type:String,default:null,validator:e=>_.includes(e)},...C(),...V()},"VCol"),W=d()({name:"VCol",props:p(),setup(e,a){let{slots:t}=a;const l=S(()=>{const n=[];let s;for(s in b)b[s].forEach(r=>{const u=e[r],m=H(s,r,u);m&&n.push(m)});const o=n.some(r=>r.startsWith("v-col-"));return n.push({"v-col":!o||!e.cols,[`v-col-${e.cols}`]:e.cols,[`offset-${e.offset}`]:e.offset,[`order-${e.order}`]:e.order,[`align-self-${e.alignSelf}`]:e.alignSelf}),n});return()=>{var n;return k(e.tag,{class:[l.value,e.class],style:e.style},(n=t.default)==null?void 0:n.call(t))}}}),g=["start","end","center"],L=["space-between","space-around","space-evenly"];function y(e,a){return i.reduce((t,l)=>{const n=e+c(l);return t[n]=a(),t},{})}const I=[...g,"baseline","stretch"],$=e=>I.includes(e),h=y("align",()=>({type:String,default:null,validator:$})),R=[...g,...L],w=e=>R.includes(e),E=y("justify",()=>({type:String,default:null,validator:w})),T=[...g,...L,"stretch"],A=e=>T.includes(e),O=y("alignContent",()=>({type:String,default:null,validator:A})),v={align:Object.keys(h),justify:Object.keys(E),alignContent:Object.keys(O)},U={align:"align",justify:"justify",alignContent:"align-content"};function D(e,a,t){let l=U[e];if(t!=null){if(a){const n=a.replace(e,"");l+=`-${n}`}return l+=`-${t}`,l.toLowerCase()}}const x=f({dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:$},...h,justify:{type:String,default:null,validator:w},...E,alignContent:{type:String,default:null,validator:A},...O,...C(),...V()},"VRow"),Y=d()({name:"VRow",props:x(),setup(e,a){let{slots:t}=a;const l=S(()=>{const n=[];let s;for(s in v)v[s].forEach(o=>{const r=e[o],u=D(s,o,r);u&&n.push(u)});return n.push({"v-row--no-gutters":e.noGutters,"v-row--dense":e.dense,[`align-${e.align}`]:e.align,[`justify-${e.justify}`]:e.justify,[`align-content-${e.alignContent}`]:e.alignContent}),n});return()=>{var n;return k(e.tag,{class:["v-row",l.value,e.class],style:e.style},(n=t.default)==null?void 0:n.call(t))}}}),F=f({disabled:Boolean,modelValue:{type:Boolean,default:void 0},...M()},"VHover"),Z=d()({name:"VHover",props:F(),emits:{"update:modelValue":e=>!0},setup(e,a){let{slots:t}=a;const l=G(e,"modelValue"),{runOpenDelay:n,runCloseDelay:s}=B(e,o=>!e.disabled&&(l.value=o));return()=>{var o;return(o=t.default)==null?void 0:o.call(t,{isHovering:l.value,props:{onMouseenter:n,onMouseleave:s}})}}});export{Y as V,W as a,Z as b};
