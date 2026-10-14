/* Portfolio interactions — no React or build tools needed. */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const path = v => String(v || '').replace(/^\//,'');
const p = PORTFOLIO;
$('#year').textContent = new Date().getFullYear();
$('.menu').addEventListener('click',()=>$('#navlinks').classList.toggle('open'));
document.querySelectorAll('#navlinks a').forEach(a=>a.addEventListener('click',()=>$('#navlinks').classList.remove('open')));
const categories=['All',...new Set(p.projects.map(x=>x.category).filter(Boolean))];
function renderProjects(category='All'){
 $('#filters').innerHTML=categories.map(c=>`<button class="filter ${c===category?'active':''}" data-category="${esc(c)}">${esc(c)}</button>`).join('');
 $('#project-grid').innerHTML=p.projects.filter(x=>category==='All'||x.category===category).map(x=>`<button class="project-card" data-project="${esc(x.id)}"><img loading="lazy" src="${esc(path(x.cover))}" alt="${esc(x.title)}"><div class="project-info"><span class="meta">${esc(x.category)}</span><h3>${esc(x.title)}</h3><p>${esc((x.description||'').slice(0,135))}...</p><span class="meta">VIEW PROJECT ↗</span></div></button>`).join('');
 document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>renderProjects(b.dataset.category));
 document.querySelectorAll('.project-card').forEach(b=>b.onclick=()=>openProject(b.dataset.project));
}
const videoId = url => {let m=String(url||'').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);return m?m[1]:null};
function openProject(id){let x=p.projects.find(a=>a.id===id);if(!x)return;let videos=[x.youtube,...(x.videos||[])].filter(Boolean);$('#modal-inner').innerHTML=`<span class="meta">${esc(x.category)} · ${esc(x.engine||'')}</span><h2>${esc(x.title)}</h2><p>${esc(x.description)}</p>${videos.map(v=>videoId(v)?`<iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/${videoId(v)}" title="Project video" allowfullscreen></iframe>`:'').join('')}<div class="modal-gallery">${(x.images?.length?x.images:[x.cover]).map(i=>`<img loading="lazy" src="${esc(path(i))}" alt="${esc(x.title)}">`).join('')}</div>${x.tags?.length?`<div class="tags">${x.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}${x.link?`<a class="btn primary" href="${esc(x.link)}" target="_blank" rel="noopener noreferrer">VIEW ORIGINAL PROJECT ↗</a>`:''}`;$('#modal').hidden=false;document.body.style.overflow='hidden';}
function closeProject(){$('#modal').hidden=true;document.body.style.overflow='';$('#modal-inner').innerHTML='';}
document.querySelectorAll('[data-close]').forEach(x=>x.addEventListener('click',closeProject));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeProject()});
function entries(items,fn){return (items||[]).map(fn).join('')}
$('#experience-list').innerHTML=entries(p.experience,x=>`<article class="entry"><h3>${esc(x.role||x.title||x.position||'')}</h3><div class="meta">${esc(x.company||'')} · ${esc(x.period||x.duration||'')}</div><p>${esc(x.description||'')}</p>${Array.isArray(x.bullets||x.highlights)?`<ul>${(x.bullets||x.highlights).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`:''}</article>`);
$('#skills-list').innerHTML=entries(p.personalSkills,x=>`<span class="tag">${esc(typeof x==='string'?x:x.name||x.title)}</span>`);
$('#software-list').innerHTML=entries(p.softwareKnown,x=>`<div><span>${esc(x.name)}</span><small>${esc(x.tier)}</small></div>`);
$('#cert-list').innerHTML=entries(p.certifications,x=>`<article class="entry"><h3>${esc(x.title)}</h3><div class="meta">${esc(x.issuer)} · ${esc(x.year)}</div></article>`);
$('#education-list').innerHTML=entries(p.education,x=>`<article class="entry"><h3>${esc(x.degree)}</h3><div class="meta">${esc(x.school)} · ${esc(x.period)}</div><p>${esc(x.detail)}</p></article>`);
$('#contact-form').addEventListener('submit',async e=>{e.preventDefault();const status=$('#form-status'),btn=e.currentTarget.querySelector('button');status.textContent='Sending...';btn.disabled=true;try{let r=await fetch('https://formspree.io/f/maqrjlog',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(e.currentTarget)))});if(!r.ok)throw Error();status.textContent='Message sent successfully!';e.currentTarget.reset()}catch{status.textContent='Could not send. Please email me directly instead.'}finally{btn.disabled=false}});
renderProjects();