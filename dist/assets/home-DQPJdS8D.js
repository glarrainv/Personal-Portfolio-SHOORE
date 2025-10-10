(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const e of o.addedNodes)e.tagName==="LINK"&&e.rel==="modulepreload"&&i(e)}).observe(document,{childList:!0,subtree:!0});function a(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(t){if(t.ep)return;t.ep=!0;const o=a(t);fetch(t.href,o)}})();async function u(){try{const s=await fetch("https://notion-proxy.glarrain.workers.dev");if(!s.ok)throw new Error(`HTTP error! Status: ${s.status}`);return await s.json()}catch(s){throw console.error("Error fetching projects from backend:",s),s}}function m(){return[{id:"redreport",title:"Redreport",description:'"Believing in your own story carries no shame" - A tool for Notre Dame students to anonymously report aggressions',status:"Done",projectLink:"https://reddot.report",dateRange:"2025-02-01",tools:["Typescript","React","CSS","R"]},{id:"cs4good",title:"Statistic Game for Kids",description:"A dashboard built for Professor Brockman from the University of Notre Dame to teach elementary kids basic statistics",status:"Done",projectLink:"https://github.com/slayer1371/cs4good-beanbag",dateRange:"2024-09-01 to 2024-12-11",tools:["React","JS","MongoDB","HTML","CSS"]},{id:"translation",title:"LLM Chinese to English Translation Assistant",description:"A Qwen3-powered translation tool that breaks down the meaning behind the English translation in Chinese",status:"In progress",projectLink:"https://github.com/glarrainv/TranslationAssistant",dateRange:"2025-06-20 to present",tools:["Prompt Engineering","HTML","CSS","JS","OpenRouterAPI"]}]}function c(s){const n=document.querySelector("#Projects .grid"),a=document.querySelector("#Progress .grid");if(!n){console.error("Could not find projects container");return}i(),t();function i(){s.filter(e=>e.status=="Done").forEach(e=>{const r=document.createElement("div");r.className="project-card lightyellowbg shade",e.projectLink&&(r.className+=" link"),r.onclick=()=>{e.projectLink&&window.open(e.projectLink,"_blank")};const l=e.tools?e.tools.join(", "):"";r.innerHTML=`
      <div class="text z-2 pos-rel slide-right" style="width: 100%;">
        <h2 class="sm">${e.title||"Untitled Project"}</h2>
        <h4 class="xs fw-light m-0"><i>${e.description||""}</i></h4>
        <h6 class="m-1">${l}</h6>
        <div class="project-details">
          <div class="status m-1"><small>Status: ${e.status||""}</small></div>
          <div class=" date m-0"><small>Date Range: ${e.dateRange||""}</small></div>
        </div>
      </div>
    `,n.appendChild(r)})}function t(){s.reverse().filter(e=>e.status=="In progress").forEach(e=>{const r=document.createElement("div");if(r.className="project-banner shade",e.projectLink&&(r.className+=" link",r.onclick=()=>{window.open(e.projectLink,"_blank")}),e.Image)console.log(e.Image),r.style.backgroundImage=`url('${e.Image}')`;else{const l=e.tools?e.tools.join(", "):"";r.innerHTML=`
      <div class="text z-2 pos-rel slide-right" style="width: 100%;">
        <h2 class="sm">${e.title||"Untitled Project"}</h2>
        <h4 class="xs fw-light m-0"><i>${e.description||""}</i></h4>
        <h6 class="m-1">${l}</h6>
        <div class="project-details">
          <div class="status m-1"><small>Status: ${e.status||""}</small></div>
          <div class=" date m-0"><small>Date Range: ${e.dateRange||""}</small></div>
        </div>
      </div>
    `}a.appendChild(r)})}}async function d(){try{console.log("Fetching projects from backend...");const s=await u();console.log(`Found ${s.length} projects.`),c(s)}catch(s){console.error("Failed to load projects from backend:",s),console.log("Using fallback static content"),c(m())}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",d):d();
