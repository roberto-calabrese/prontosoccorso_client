import{f as p}from"./delay.DnqcwUpY.js";import{ab as f,j as _,N as h,ao as x,ae as r,af as l,ag as e,c as s,ai as g,aj as V,K as C,F as w,ah as t,a2 as d,m as y,a9 as i}from"./entry.P9U4DgVG.js";import{V as v,a as N}from"./VRow.BUyRS-X9.js";import{V as b,a as k,b as B}from"./VContainer.C8ZZt-4V.js";import{V as j}from"./VHover.I-NdgVYA.js";import"./VAvatar.D6_j-P20.js";const E=t("h2",{class:"my-8 text-uppercase"},[d("Pronto soccorso in "),t("span",{class:"text-green-accent-4"},"tempo reale")],-1),F={class:"mt-2 text-amber-accent-3"},P={class:"text-uppercase text-caption font-weight-medium"},M={class:"text-amber-accent-4 text-sm-h6"},A=f({__name:"index",setup(T){const n=_();return h(async()=>{try{const a=await p("regioni");if(!a)throw x({statusCode:404,statusMessage:"Page Not Found"});n.value=a.regioni}catch(a){console.error("Error fetching data:",a)}}),(a,D)=>(r(),l(b,{class:"pa-4 text-center",fluid:""},{default:e(()=>[E,s(v,{align:"center",class:"fill-height",justify:"center"},{default:e(()=>[(r(!0),g(w,null,V(C(n),(o,m)=>(r(),l(N,{key:m,cols:"12",md:"3"},{default:e(()=>[s(j,null,{default:e(({isHovering:c,props:u})=>[s(k,y({class:{"on-hover":c},elevation:c?12:2},u,{to:o.nome}),{default:e(()=>[s(B,{class:"text-uppercase text-h5 text-white d-flex flex-column"},{default:e(()=>[t("p",F,i(o.nome),1),t("div",null,[t("p",P,[d(" numero ospedali: "),t("strong",M,i(o.numero_ospedali),1)])])]),_:2},1024)]),_:2},1040,["class","elevation","to"])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}))}});export{A as default};
