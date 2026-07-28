const API_URL = window.F4F_CONFIG?.apiUrl || "";
const BUSINESS_EMAIL = "Fenton4Fitness@gmail.com";
const CONTACT_CONFIRMATION = "Thanks for contacting Fenton4Fitness. John or Jess will review your information and follow up as soon as possible.";

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const instagramUrl = "https://www.instagram.com/fenton4fitness/";
if (navLinks && !navLinks.querySelector('a[href="merch.html"]')) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = "merch.html";
  link.textContent = "F4F Apparel";
  if (location.pathname.endsWith("/merch.html")) link.setAttribute("aria-current", "page");
  item.appendChild(link);
  navLinks.insertBefore(item, navLinks.lastElementChild);
}

document.querySelectorAll(".site-footer .container").forEach((footer) => {
  const fineprint = footer.querySelector(".fineprint");
  if (!footer.querySelector(".business-email-footer")) {
    const email = document.createElement("p");
    email.innerHTML = `<a class="business-email-footer" href="mailto:${BUSINESS_EMAIL}">${BUSINESS_EMAIL}</a>`;
    footer.insertBefore(email, fineprint);
  }
  if (!footer.querySelector(".instagram-footer")) {
    const link = document.createElement("p");
    link.innerHTML = `<a class="instagram-footer" href="${instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Follow Fenton4Fitness on Instagram (opens in a new tab)">Follow @fenton4Fitness on Instagram ↗</a>`;
    footer.insertBefore(link, fineprint);
  }
  if (!footer.querySelector(".business-websites-footer")) {
    const businessLink = document.createElement("p");
    businessLink.innerHTML = '<a class="business-websites-footer" href="business-websites.html">Websites for Small Businesses</a>';
    footer.insertBefore(businessLink, fineprint);
  }
  if (!footer.querySelector(".apparel-footer")) {
    const apparelLink = document.createElement("p");
    apparelLink.innerHTML = '<a class="apparel-footer" href="merch.html">F4F Apparel</a>';
    footer.insertBefore(apparelLink, fineprint);
  }
});

document.querySelectorAll("form[data-aws-form]").forEach((form) => {
  if (!form.querySelector(".business-email-form")) {
    const email = document.createElement("p");
    email.className = "business-email-form form-note";
    email.innerHTML = `Prefer email? Contact <a href="mailto:${BUSINESS_EMAIL}">${BUSINESS_EMAIL}</a>.`;
    form.insertBefore(email, form.querySelector("button[type='submit']"));
  }
});

if (document.querySelector("#lead-form")) {
  const contactHeader = document.querySelector(".page-hero .container");
  if (contactHeader && !contactHeader.querySelector(".business-email-contact")) {
    const email = document.createElement("p");
    email.className = "business-email-contact";
    email.innerHTML = `Email us directly at <a href="mailto:${BUSINESS_EMAIL}">${BUSINESS_EMAIL}</a>.`;
    contactHeader.appendChild(email);
  }
}

const clientType = document.querySelector("#client-type");
function updateConditionalFields() {
  if (!clientType) return;
  const youth = ["parent-guardian", "youth-athlete"].includes(clientType.value);
  document.querySelectorAll("[data-for='youth']").forEach((element) => {
    element.hidden = !youth;
  });
}

if (clientType) {
  const requestedType = new URLSearchParams(location.search).get("type");
  const typeMap = { youth: "parent-guardian", adults: "adult", adult: "adult", teams: "team", team: "team" };
  if (typeMap[requestedType]) clientType.value = typeMap[requestedType];
  clientType.addEventListener("change", updateConditionalFields);
  updateConditionalFields();
}

function leadTypeFor(value) {
  return ({
    "parent-guardian": "youth-athlete",
    "youth-athlete": "youth-athlete",
    adult: "adult-personal-training",
    team: "team-training",
    other: "general-inquiry"
  })[value] || "general-inquiry";
}

function relevantEntries(form) {
  const data = Object.fromEntries(new FormData(form).entries());
  delete data.website;
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== ""));
}

function buildPayload(form) {
  const data = relevantEntries(form);
  const payload = { ...data, submittedAt: new Date().toISOString() };

  if (form.id === "lead-form") {
    payload.submissionType = "lead";
    payload.leadType = leadTypeFor(data.clientType);
    payload.message = data.goals || data.additionalDetails || "";
    payload.sport = data.primarySport || "";
    payload.team = data.clientType === "team" ? (data.name || "") : "";
    payload.programType = data.preferredTraining || "";
    payload.consentToContact = data.contactConsent === "yes";
    payload.athleteName = data.athleteName || data.name || "";
    payload.athleteAge = data.athleteAge || "";
    payload.primarySport = data.primarySport || "";
    payload.parentName = data.clientType === "parent-guardian" ? data.name : "";
    payload.parentEmail = data.email || "";
    payload.parentPhone = data.phone || "";
    payload.athleteGoals = data.goals || "";
    payload.injuryHistory = data.injuryHistory || "Not provided";
    payload.trainingHistory = data.experienceLevel || "";
    payload.otherInterests = data.additionalDetails || "";
  } else if (form.id === "website-service-form") {
    payload.submissionType = "website-service-inquiry";
    payload.leadType = "business-website";
    payload.message = data.helpNeeded || data.additionalInformation || "";
    payload.requestedHelp = data.helpNeeded || "";
    payload.expectedPages = data.pageCount || "";
    payload.siteStatus = data.projectType || "";
    payload.contactFormNeeded = data.leadFormNeeded || "";
    payload.automationInterest = data.automation || "";
    payload.budgetRange = data.budget || "";
    payload.consentToContact = data.contactConsent === "yes";
    payload.parentName = data.name || "";
    payload.parentEmail = data.email || "";
    payload.parentPhone = data.phone || "";
    payload.athleteName = data.businessName || "";
    payload.athleteAge = "";
    payload.primarySport = data.businessType || "";
    payload.athleteGoals = data.helpNeeded || "";
    payload.injuryHistory = "Not applicable";
    payload.trainingHistory = `${data.projectType || ""}; ${data.pageCount || ""}; automation: ${data.automation || ""}`;
    payload.otherInterests = `${data.businessOffer || ""}; ${data.additionalInformation || ""}`;
  } else {
    payload.submissionType = "testimonial";
    payload.leadType = "testimonial";
    payload.message = data.experience || "";
    payload.team = data.program || "";
    payload.permissionToPublish = data.permissionPublish === "yes";
    payload.permissionToUseFullName = data.permissionFullName === "yes";
    payload.permissionToUsePhoto = data.permissionPhoto === "yes";
    payload.parentName = data.name || "";
    payload.parentEmail = data.email || "";
    payload.parentPhone = "";
    payload.athleteName = data.name || "";
    payload.athleteAge = "";
    payload.primarySport = data.program || "";
    payload.athleteGoals = data.experience || "";
    payload.injuryHistory = "Not applicable";
    payload.trainingHistory = data.improvements || "";
    payload.otherInterests = data.standout || "";
  }

  return payload;
}

function showStatus(status, type, message) {
  status.className = `form-status ${type}`;
  status.textContent = message;
  status.hidden = false;
  status.focus({ preventScroll: true });
}

async function submitForm(form) {
  const status = form.querySelector(".form-status");
  const submit = form.querySelector("button[type='submit']");
  if (!form.checkValidity()) {
    showStatus(status, "error", "Please complete the required fields highlighted below, then submit again.");
    form.reportValidity();
    return;
  }

  const honeypot = form.elements.website;
  if (honeypot?.value) return;
  if (!API_URL) {
    showStatus(status, "error", "The inquiry service is not configured. Please email Fenton4Fitness directly.");
    console.error("Form submission failed: missing API endpoint configuration.");
    return;
  }

  const payload = buildPayload(form);
  const originalLabel = submit.dataset.label || submit.textContent || "Submit";
  submit.disabled = true;
  submit.textContent = "Sending…";
  status.hidden = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();
    if (!response.ok) throw new Error(`Request failed with HTTP ${response.status}`);
    let responseBody = null;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText);
      } catch {
        responseBody = responseText;
      }
    }
    console.info("Fenton4Fitness form submitted", {
      formId: form.id,
      leadType: payload.leadType,
      status: response.status,
      response: responseBody
    });

    const successMessage = form.id === "website-service-form"
      ? `${CONTACT_CONFIRMATION} For website-service inquiries, John will also review the requested project scope and features.`
      : form.id === "testimonial-form"
        ? `${CONTACT_CONFIRMATION} Your testimonial was submitted for private review and will never be published without permission.`
        : CONTACT_CONFIRMATION;
    form.reset();
    updateConditionalFields();
    showStatus(status, "success", successMessage);
  } catch (error) {
    console.error("Fenton4Fitness form submission failed", {
      formId: form.id,
      message: error instanceof Error ? error.message : String(error)
    });
    showStatus(status, "error", `We couldn't send your form. Your entries are still here. Please try again or email ${BUSINESS_EMAIL}.`);
  } finally {
    submit.disabled = false;
    submit.textContent = originalLabel;
  }
}

document.querySelectorAll("form[data-aws-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitForm(form);
  });
});

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
