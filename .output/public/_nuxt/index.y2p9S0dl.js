import{f as p,a as _,b as x,d as h}from"./VContainer.CFE40T0W.js";import{aw as g,k as V,O as C,ax as w,ap as r,am as i,an as e,c as s,ar as y,as as k,L as v,F as b,aq as t,ad as u,m as B,ak as d}from"./entry.BRUJAajJ.js";import{H as L}from"./VImg.CWi_Od0n.js";import{V as N,a as E,b as F}from"./VHover.Ci55EjJu.js";const P=t("h2",{class:"my-8 text-uppercase"},[u("Pronto soccorso in "),t("span",{class:"text-green-accent-4"},"tempo reale")],-1),S={class:"mt-2 text-amber-accent-3"},T={class:"text-uppercase text-caption font-weight-medium"},M={class:"text-amber-accent-4 text-sm-h6"},z=g({__name:"index",setup(j){const n=L();n.setLoading(!0);const c=V();return C(async()=>{try{const a=await p("regioni");if(!a)throw w({statusCode:404,statusMessage:"Page Not Found"});c.value=a.regioni}catch(a){console.error("Error fetching data:",a)}finally{setTimeout(()=>{n.setLoading(!1)},1e3)}}),(a,q)=>(r(),i(_,{class:"pa-4 text-center",fluid:""},{default:e(()=>[P,s(N,{align:"center",class:"fill-height",justify:"center"},{default:e(()=>[(r(!0),y(b,null,k(v(c),(o,m)=>(r(),i(E,{key:m,cols:"12",md:"3"},{default:e(()=>[s(F,null,{default:e(({isHovering:l,props:f})=>[s(x,B({class:{"on-hover":l},elevation:l?12:2},f,{to:o.nome}),{default:e(()=>[s(h,{class:"text-uppercase text-h5 text-white d-flex flex-column"},{default:e(()=>[t("p",S,d(o.nome),1),t("div",null,[t("p",T,[u(" numero ospedali: "),t("strong",M,d(o.numero_ospedali),1)])])]),_:2},1024)]),_:2},1040,["class","elevation","to"])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}))}});export{z as default};
