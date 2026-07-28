const testimonialRoot=document.querySelector("#testimonial-list");
if(testimonialRoot){const approved=(window.F4F_TESTIMONIALS||[]).filter(x=>x.permissionStatus==="approved");testimonialRoot.innerHTML=approved.length?approved.map(x=>`<article class="card" data-category="${x.category||"all"}" data-coach="${x.coachRelationship||"fenton4fitness"}"><p class="quote">“${x.shortQuote}”</p><p>${x.fullTestimonial||""}</p><p class="quote-note">${x.permissionFullName?x.name:"Fenton4Fitness client"} · ${x.program||x.clientType||"Client"}</p></article>`).join(""):`<div class="empty-state"><strong>Client stories are being gathered thoughtfully.</strong><p>Only approved, permission-based testimonials will appear here. Current and former clients can share an experience through our private review form.</p><a class="btn btn-secondary" href="submit-testimonial.html">Share your experience</a></div>`;}
const optionsRoot=document.querySelector("#training-options-list");
if(optionsRoot){optionsRoot.innerHTML=(window.F4F_TRAINING_OPTIONS||[]).map(x=>`<article class="card"><span class="eyebrow">${x.audience}</span><h3>${x.title}</h3><p>${x.description}</p><p class="quote-note">Options and availability are discussed after the initial inquiry.</p><a href="contact-us.html?type=${x.audience.toLowerCase()}" class="card-link">Request information →</a></article>`).join("");}
const packageRoot=document.querySelector("#website-package-list");
if(packageRoot){packageRoot.innerHTML=(window.F4F_WEBSITE_PACKAGES||[]).map(x=>`<article class="card package-card"><p class="eyebrow">${x.price}</p><h3>${x.title}</h3><p>${x.description}</p><ul class="list-check">${x.features.map(f=>`<li>${f}</li>`).join("")}</ul><a class="card-link" href="#website-inquiry">Ask about this option →</a></article>`).join("");}
const apparel=window.F4F_APPAREL;
if(apparel){
  document.querySelectorAll("[data-apparel-name]").forEach(element=>{element.textContent=apparel.productName;});
  document.querySelectorAll("[data-apparel-color]").forEach(element=>{element.textContent=apparel.color;});
  document.querySelectorAll("[data-apparel-status]").forEach(element=>{element.textContent=apparel.productStatus;});
  document.querySelectorAll("[data-apparel-description]").forEach(element=>{element.textContent=apparel.description;});
  document.querySelectorAll("[data-apparel-price]").forEach(element=>{element.textContent=apparel.price||"Coming soon";});
  const setPreview=(selector,src,alt)=>{
    const root=document.querySelector(selector);
    if(!root||!src)return;
    const image=root.querySelector("img")||document.createElement("img");
    image.src=src;
    image.alt=alt;
    image.width=1200;
    image.height=1500;
    image.loading="lazy";
    image.decoding="async";
    if(!image.parentElement)root.replaceChildren(image);
    root.removeAttribute("role");
    root.removeAttribute("aria-label");
  };
  setPreview("[data-apparel-front]",apparel.frontImage,apparel.frontImageAlt);
  setPreview("[data-apparel-back]",apparel.backImage,apparel.backImageAlt);
  const careRoot=document.querySelector("[data-apparel-care]");
  if(careRoot){
    careRoot.replaceChildren(...apparel.careInstructions.map(instruction=>{
      const item=document.createElement("li");
      item.textContent=instruction;
      return item;
    }));
  }
  const sizeChart=document.querySelector("[data-size-chart]");
  const sizePlaceholder=document.querySelector("[data-size-chart-placeholder]");
  if(sizeChart&&apparel.sizeChart.length){
    sizeChart.hidden=false;
    sizePlaceholder?.remove();
  }
}
