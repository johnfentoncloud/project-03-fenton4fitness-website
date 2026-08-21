"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function storage() {
  const values = new Map();
  return { getItem: key => values.has(key) ? values.get(key) : null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}

const localStorage = storage();
const context = {
  window: { F4F_CONFIG: {}, localStorage }, localStorage,
  location: { search: "", pathname: "/index.html" }, URLSearchParams, Date, Set, JSON, console,
  document: { querySelector: () => null, querySelectorAll: () => [] },
  FormData: class { constructor(form) { this.form = form; } entries() { return this.form._entries; } }, fetch: async () => { throw new Error("not used"); }
};
context.window.window = context.window;
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, "..", "website-files", "script.js"), "utf8"), context);
const attribution = context.window.F4F_ATTRIBUTION;
const day = 24 * 60 * 60 * 1000;
const start = Date.parse("2026-08-20T12:00:00Z");

assert.strictEqual(attribution.captureAttribution("?source=unknown", "/athlete-development", start, localStorage), null);
const first = attribution.captureAttribution("?source=rise_small_group_flyer&campaign=fall_2026", "/athlete-development", start, localStorage);
assert.strictEqual(first.source, "rise_small_group_flyer");
assert.strictEqual(first.campaign, "fall_2026");
assert.strictEqual(first.landingPage, "/athlete-development");
assert.strictEqual(attribution.captureAttribution("?source=instagram", "/index.html", start + day, localStorage).source, "rise_small_group_flyer");
assert.strictEqual(attribution.readAttribution(start + 29 * day, localStorage).source, "rise_small_group_flyer");
assert.strictEqual(attribution.readAttribution(start + 31 * day, localStorage), null);
assert.strictEqual(attribution.captureAttribution("?source=instagram&campaign=BAD%20VALUE", "/index.html", start + 31 * day, localStorage).campaign, undefined);
localStorage.removeItem("f4f:first-touch-attribution:v1");
attribution.captureAttribution("?source=instagram", "/index.html", Date.now(), localStorage);
const attributedPayload = context.buildPayload({ id: "lead-form", _entries: [["clientType", "parent-guardian"], ["name", "Demo Parent"], ["email", "demo@example.test"], ["preferredTraining", "small_group_athlete_development"], ["goals", "Synthetic goal"], ["contactConsent", "yes"]] });
assert.strictEqual(attributedPayload.source, "instagram");
assert.strictEqual(attributedPayload.programType, "small_group_athlete_development");
localStorage.removeItem("f4f:first-touch-attribution:v1");
const directPayload = context.buildPayload({ id: "lead-form", _entries: [["clientType", "team"], ["name", "Demo Coach"], ["email", "coach@example.test"], ["goals", "Synthetic goal"], ["contactConsent", "yes"]] });
assert.strictEqual(directPayload.source, undefined);

const page = fs.readFileSync(path.join(__dirname, "..", "website-files", "athlete-development.html"), "utf8");
assert.match(page, /id="old-line"/); assert.match(page, /id="rise"/);
assert.match(page, /program=team_training/); assert.match(page, /program=small_group_athlete_development/);
assert.match(page, /Rise gym access or membership requirements may apply/);
console.log("Marketing attribution, expiry, canonical page anchors, and gym CTA tests passed.");
