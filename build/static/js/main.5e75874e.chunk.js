(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{33:function(e,t,n){e.exports=n(59)},57:function(e,t,n){},59:function(e,t,n){"use strict";n.r(t);n(34);var a=n(1),r=n(9),c=n(3),l=n(62),i=n(64),o=n(63),u=n(61),s=n(4),m=n(60);function E(e){if(e){var t=e.address.cityName,n=e.address.state;return t?t+" - "+n:n}return""}var h=n(22),d=n(28),p="http://localhost:3000/api";function f(){var e=this;return function(t,n){return c.b(e,void 0,void 0,function(){var e,a,r,l;return c.c(this,function(i){switch(i.label){case 0:if((e=n().locationsCache).isFetching||e.locations)return[3,4];t({type:"FetchTransactionsStart",reducer:function(e){return c.a({},e,{locationsCache:{isFetching:!0}})}}),i.label=1;case 1:return i.trys.push([1,3,,4]),[4,h.get(p+"/locations")];case 2:return a=i.sent(),r=a.body,t(function(e){return{type:"FetchLocationsSuccess",reducer:function(t){return c.a({},t,{locationsCache:{isFetching:!1,locations:e}})}}}(r)),[3,4];case 3:return l=i.sent(),t((o=l,{type:"FetchLocationsFailure",reducer:function(e){return c.a({},e,{locationsCache:{isFetching:!1,error:o}})}})),[3,4];case 4:return[2]}var o})})}}function y(e){var t=this;return function(n,a){return c.b(t,void 0,void 0,function(){var t,r,l,i;return c.c(this,function(o){switch(o.label){case 0:if((t=a().transactionsCache).isFetching||t.transactions&&d.isEqual(t.query,e))return[3,4];n(function(e){return{type:"FetchTransactionsStart",reducer:function(t){return c.a({},t,{transactionsCache:{isFetching:!0,query:e}})}}}(e)),o.label=1;case 1:return o.trys.push([1,3,,4]),[4,h.get(p+"/transactions").query(e)];case 2:return r=o.sent(),l=r.body,n(function(e){return{type:"FetchTransactionsSuccess",reducer:function(t){return c.a({},t,{transactionsCache:{query:t.transactionsCache.query,isFetching:!1,transactions:e}})}}}(l)),[3,4];case 3:return i=o.sent(),n((u=i,{type:"FetchTransactionsFailure",reducer:function(e){return c.a({},e,{transactionsCache:{isFetching:!1,error:u}})}})),[3,4];case 4:return[2]}var u})})}}var v=n(11);var g=Object(v.b)(function(e){return{cache:e.locationsCache}},function(e){var t=this;return{onInit:function(){return c.b(t,void 0,void 0,function(){return c.c(this,function(t){return[2,e(f())]})})}}})(function(e){var t=e.cache;(0,e.onInit)();var n=t.isFetching,r=t.locations;return r?a.createElement(s.d,null,a.createElement(s.a,null,a.createElement(s.b,{active:!0},"Empresas")),a.createElement("h2",null,"Empresas(",r.length,")"),a.createElement("p",null,"Clique sobre uma linha para abrir as transa\xe7\xf5es da empresa desejada."),a.createElement(s.e,{style:{opacity:n?.5:1}},r.map(function(e,t){return a.createElement(s.f,{key:t},a.createElement(m.a,{to:"/transactions?companyLocation="+e.code},a.createElement(s.i,null,a.createElement(s.c,{md:"3"},e.email),a.createElement(s.c,{md:"3"},e.federalTaxId),a.createElement(s.c,{md:"3"},E(e)),a.createElement(s.c,{md:"3"},e.address.phone))))}))):a.createElement("h2",null,"Carregando...")}),b=n(12),C=n(31);function F(e,t){return void 0===e&&(e={locationsCache:{isFetching:!1},transactionsCache:{isFetching:!1}}),t.reducer?t.reducer(e):e}var T,x=n(13),S=n(10),I=n.n(S),q=n(32);function L(e){var t=e.name,n=e.value,r=e.currency,c=void 0===r?"BRL":r;return a.createElement("div",null,a.createElement("span",{style:{float:"left"}},t),a.createElement("span",{style:{float:"right"}},n.toLocaleString("pt-BR",{style:"currency",currency:c})))}function k(e){var t=e.title,n=e.entity;return a.createElement("div",null,a.createElement("h4",null,t),n&&a.createElement("div",null,n.federalTaxId,a.createElement("br",null),E(n),a.createElement("br",null),n.taxRegime&&a.createElement("span",null,n.taxRegime,a.createElement("br",null)),n.type&&a.createElement("span",null,n.type,a.createElement("br",null)),n.suframa&&"Suframa: "+n.suframa))}function w(e){var t=e.transaction,n=t.header,r=n.currency,l=t.calculatedTaxSummary;return a.createElement("div",null,a.createElement(s.i,null,a.createElement(I.a,{lg:"4"},a.createElement("h3",null,n.transactionType)),a.createElement(I.a,{lg:"4"},"Data: ",q(n.transactionDate).format("DD/MM/YYYY")),a.createElement(I.a,{lg:"4"},"C\xf3digo: ",n.documentCode)),a.createElement(s.i,null,a.createElement(I.a,{lg:"4"},a.createElement(k,{title:"Empresa",entity:n.location})),a.createElement(I.a,{lg:"4"},a.createElement(k,{title:"Contraparte",entity:n.entity})),a.createElement(I.a,{lg:"4"},a.createElement("h4",null,"Resumo"),a.createElement(L,c.a({},{name:"Subtotal:",value:l.subtotal,currency:r})),a.createElement("br",null),a.createElement(L,c.a({},{name:"IEC:",value:l.taxByType.iec.tax,currency:r})),a.createElement("br",null),a.createElement(L,c.a({},{name:"IST:",value:l.taxByType.ist.tax,currency:r})),a.createElement("br",null),a.createElement(L,c.a({},{name:"ISC:",value:l.taxByType.isc.tax,currency:r})),a.createElement("br",null),a.createElement("hr",null),a.createElement(L,c.a({},{name:"TOTAL GERAL:",value:l.grandTotal,currency:r})))))}function j(e){return"/transactions?"+T+"&page="+e.toString()}var B,D=Object(v.b)(function(e,t){var n=e.transactionsCache,a=t.location.search,r=x.parse(a);return{cache:n,page:Number(r.page||"1")}},function(e,t){var n=this,a=t.location.search,r=x.parse(a);return delete r.page,{onInit:function(){return c.b(n,void 0,void 0,function(){return c.c(this,function(t){return[2,e(y(r))]})})}}})(function(e){var t=e.page,n=e.cache;(0,e.onInit)();var r=n.isFetching,l=n.transactions;if(T=x.stringify(n.query),l){var i=l.length,o=10*(t-1),u=Math.min(10*t,i),E=Math.ceil(i/10);return a.createElement(s.d,null,a.createElement(s.a,null,a.createElement(s.b,null,a.createElement(m.a,{to:"/locations"},"Empresas")),a.createElement(s.b,null,"Transa\xe7\xf5es")),a.createElement("h2",null,"Transa\xe7\xf5es ",o+1," a ",u," de ",l.length),a.createElement("p",null,"Clique sobre uma linha para abrir a transa\xe7\xe3o desejada."),a.createElement(s.e,{style:{opacity:r?.5:1}},l.slice(o,u).map(function(e,t){return a.createElement(s.f,{key:t},a.createElement(m.a,{to:"/transaction?companyLocation="+e.header.companyLocation+"&transactionDate="+e.header.transactionDate+"&documentCode="+e.header.documentCode},a.createElement(w,c.a({},{transaction:e}))))})),a.createElement("p",null),a.createElement(s.g,{style:{justifyContent:"center"}},a.createElement(s.h,{disabled:t<=1},a.createElement(m.a,{className:"page-link",to:j(t-1)},"\xab")),Array.from({length:E}).map(function(e,n){return a.createElement(s.h,{active:t===n+1,key:n},a.createElement(m.a,{className:"page-link",to:j(n+1)},n+1))}),a.createElement(s.h,{disabled:t>=E},a.createElement(m.a,{className:"page-link",to:j(t+1)},"\xbb"))))}return a.createElement("h2",null,"Carregando...")}),R=(void 0===B&&(B={locationsCache:{isFetching:!1},transactionsCache:{isFetching:!1}}),Object(b.c)(F,B,Object(b.a)(C.a)));n(57);r.render(a.createElement(function(){return a.createElement(v.a,c.a({},{store:R}),a.createElement(l.a,null,a.createElement(i.a,null,a.createElement(o.a,{exact:!0,path:"/",render:(e="/locations",function(){return a.createElement(u.a,{to:e})})}),a.createElement(o.a,{path:"/locations",component:g}),a.createElement(o.a,{path:"/transactions",component:D}))));var e},null),document.getElementById("root"))}},[[33,2,1]]]);
//# sourceMappingURL=main.5e75874e.chunk.js.map