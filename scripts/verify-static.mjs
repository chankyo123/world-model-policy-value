import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const out = join(root, "out");
const base = "/world-model-policy-value";
const site = `https://chankyo123.github.io${base}/`;
const html = readFileSync(join(out, "index.html"), "utf8");
assert(html.includes('rel="canonical" href="' + site + '"'), "Canonical URL");
assert(html.includes(site + "media/share-cover.png"), "Social preview URL");
assert(html.includes("Our position: evaluate world models together with the policies"));
assert(html.includes("https://github.com/chankyo123/world-model-policy-value"));
assert(!html.includes("chatgpt.site"), "Old hosting URL must not be published");

let checked = 0;
function localFile(url) {
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  assert(pathname.startsWith(base + "/"), `Missing project subpath: ${url}`);
  const file = join(out, pathname.slice(base.length));
  assert(existsSync(file), `Missing exported resource: ${url}`);
  checked++;
}
for (const match of html.matchAll(/(?:src|href|poster)="(\/[^"\s]+)"/g)) localFile(match[1]);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]);
}
for (const file of walk(out).filter(file => file.endsWith(".css"))) {
  for (const match of readFileSync(file, "utf8").matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    const url = match[1];
    if (url.startsWith("data:") || url.startsWith("https:")) continue;
    if (url.startsWith("/")) localFile(url);
    else {
      assert(existsSync(resolve(file, "..", url)), `Missing CSS resource: ${url}`);
      checked++;
    }
  }
}
const provenance = JSON.parse(readFileSync(join(root, "public/data/provenance.json")));
for (const item of provenance.artifacts) {
  const content = readFileSync(join(out, item.file));
  assert.equal(createHash("sha256").update(content).digest("hex"), item.sha256, item.file);
}
assert.equal(provenance.artifacts.find(item => item.file === "downloads/poster.pdf").source, "CoRL53_POSTER_A0_V11.pdf");
assert.deepEqual(
  JSON.parse(readFileSync(join(root, "components/research/results.json"))),
  JSON.parse(readFileSync(join(out, "data/results.json"))),
  "Displayed and downloadable scientific data must agree",
);
console.log(`Static export verified: ${checked} resource references, ${provenance.artifacts.length} artifact hashes, metadata and scientific data.`);
