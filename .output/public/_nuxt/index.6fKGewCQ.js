import{aw as g,al as V,k as d,O as v,ax as C,ao as w,ap as r,am as p,an as t,c as s,ar as y,as as k,L as m,F as b,aq as a,ad as n,m as N,ak as f}from"./entry.BRUJAajJ.js";import{f as B,a as E,b as F,d as L}from"./VContainer.CFE40T0W.js";import{H as T}from"./VImg.CWi_Od0n.js";import{V as M,a as P,b as R}from"./VHover.Ci55EjJu.js";const S=a("h2",{class:"my-8 text-uppercase"},[n("Dati nelle "),a("span",{class:"text-green-accent-4"},"province"),n(" disponibili")],-1),D={class:"mt-2 text-amber-accent-3"},j={class:"text-uppercase text-caption font-weight-medium"},q={class:"text-amber-accent-4 text-sm-h6"},I=g({__name:"index",setup(H){const c=T();c.setLoading(!0);const{regione:_}=V().params,l=d(),i=d();return v(async()=>{try{const e=await B(`${_}`);if(!e)throw C({statusCode:404,statusMessage:"Page Not Found"});i.value=e.regione,l.value=e.provincie}catch(e){console.error("Error fetching data:",e)}finally{setTimeout(()=>{c.setLoading(!1)},1e3)}}),(e,O)=>(r(),p(E,{class:"pa-4 text-center",fluid:""},{default:t(()=>[S,s(M,{align:"center",class:"fill-height",justify:"center"},{default:t(()=>[(r(!0),y(b,null,k(m(l),(o,h)=>(r(),p(P,{key:h,cols:"12",md:"3"},{default:t(()=>[s(R,null,{default:t(({isHovering:u,props:x})=>[s(F,N({class:{"on-hover":u},elevation:u?12:2},x,{to:m(i)+"/"+o.meta.slug}),{default:t(()=>[s(L,{class:"text-uppercase text-h5 text-white d-flex flex-column"},{default:t(()=>[a("p",D,f(o.meta.Titolo),1),a("div",null,[a("p",j,[n(" numero ospedali: "),a("strong",q,f(o.numero_ospedali),1)])])]),_:2},1024)]),_:2},1040,["class","elevation","to"])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}))}});export{I as default};
