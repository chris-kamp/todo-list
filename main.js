(()=>{var t={798:function(t,e,n){t=n.nmd(t),function(n,r){"use strict";var o={};n.PubSub=o;var i=n.define;!function(t){var e={},n=-1;function r(t,e,n){try{t(e,n)}catch(t){setTimeout(function(t){return function(){throw t}}(t),0)}}function o(t,e,n){t(e,n)}function i(t,n,i,u){var c,s=e[n],f=u?o:r;if(e.hasOwnProperty(n))for(c in s)s.hasOwnProperty(c)&&f(s[c],t,i)}function u(t){var n=String(t);return Boolean(e.hasOwnProperty(n)&&function(t){var e;for(e in t)if(t.hasOwnProperty(e))return!0;return!1}(e[n]))}function c(t,e,n,r){var o=function(t,e,n){return function(){var r=String(t),o=r.lastIndexOf(".");for(i(t,t,e,n);-1!==o;)o=(r=r.substr(0,o)).lastIndexOf("."),i(t,r,e,n);i(t,"*",e,n)}}(t="symbol"==typeof t?t.toString():t,e,r);return!!function(t){for(var e=String(t),n=u(e)||u("*"),r=e.lastIndexOf(".");!n&&-1!==r;)r=(e=e.substr(0,r)).lastIndexOf("."),n=u(e);return n}(t)&&(!0===n?o():setTimeout(o,0),!0)}t.publish=function(e,n){return c(e,n,!1,t.immediateExceptions)},t.publishSync=function(e,n){return c(e,n,!0,t.immediateExceptions)},t.subscribe=function(t,r){if("function"!=typeof r)return!1;t="symbol"==typeof t?t.toString():t,e.hasOwnProperty(t)||(e[t]={});var o="uid_"+String(++n);return e[t][o]=r,o},t.subscribeAll=function(e){return t.subscribe("*",e)},t.subscribeOnce=function(e,n){var r=t.subscribe(e,(function(){t.unsubscribe(r),n.apply(this,arguments)}));return t},t.clearAllSubscriptions=function(){e={}},t.clearSubscriptions=function(t){var n;for(n in e)e.hasOwnProperty(n)&&0===n.indexOf(t)&&delete e[n]},t.countSubscriptions=function(t){var n,r=0;for(n in e)e.hasOwnProperty(n)&&0===n.indexOf(t)&&r++;return r},t.getSubscriptions=function(t){var n,r=[];for(n in e)e.hasOwnProperty(n)&&0===n.indexOf(t)&&r.push(n);return r},t.unsubscribe=function(n){var r,o,i,u="string"==typeof n&&(e.hasOwnProperty(n)||function(t){var n;for(n in e)if(e.hasOwnProperty(n)&&0===n.indexOf(t))return!0;return!1}(n)),c=!u&&"string"==typeof n,s="function"==typeof n,f=!1;if(!u){for(r in e)if(e.hasOwnProperty(r)){if(o=e[r],c&&o[n]){delete o[n],f=n;break}if(s)for(i in o)o.hasOwnProperty(i)&&o[i]===n&&(delete o[i],f=!0)}return f}t.clearSubscriptions(n)}}(o),"function"==typeof i&&i.amd?i((function(){return o})):(void 0!==t&&t.exports&&(e=t.exports=o),e.PubSub=o,t.exports=e=o)}("object"==typeof window&&window||this)}},e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={id:r,loaded:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}n.nmd=t=>(t.paths=[],t.children||(t.children=[]),t),(()=>{"use strict";n(798);const t=function(t,{title:e,description:n,dueDate:r,category:o,project:i}){return e=e||"Untitled",n=n||"",r=r||!1,o=o||!1,i=i||"Other",console.log({title:e,description:n,dueDate:r,category:o,project:i}),{getTitle:function(){return e},setTitle:function(t){e=t},getDescription:function(){return n},setDescription:function(t){n=t},getDueDate:function(){return r},setDueDate:function(t){r=t},getCategory:function(){return o},setCategory:function(t){o=t},getProject:function(){return i},setProject:function(t){i=t}}},e=function(t,{title:e,category:n,todos:r}){return e=e||"Untitled",n=n||"",r=r||[],console.log({title:e,category:n,todos:r}),{getTitle:function(){return e},setTitle:function(t){e=t},getCategory:function(){return n},setCategory:function(t){n=t},getTodos:function(){return r},addTodo:function(t){return r.push(t),r}}},r=(()=>{const t=document.getElementById("todoTitle"),e=document.getElementById("todoDescription"),n=document.getElementById("todoDueDate"),r=document.getElementById("todoCategory"),i=document.getElementById("todoProject"),u=document.getElementById("projectTitle"),c=document.getElementById("projectCategory"),s=document.getElementById("projectTodos");return{initialise:()=>{document.getElementById("addTodo").addEventListener("click",(()=>{PubSub.publish(o.topics.ADD_TODO,{title:t.value,description:e.value,dueDate:n.value,category:r.value,project:i.value})})),document.getElementById("addProject").addEventListener("click",(()=>{PubSub.publish(o.topics.ADD_PROJECT,{title:u.value,category:c.value,todos:s.value})}))}}})(),o=(()=>{const n={},r={};return n.ADD_TODO="Add todo",r.Todo=PubSub.subscribe(n.ADD_TODO,t),n.ADD_PROJECT="Add project",r.Project=PubSub.subscribe(n.ADD_PROJECT,e),{topics:n,tokens:r}})();r.initialise()})()})();