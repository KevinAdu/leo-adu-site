import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const enDir = path.join(root, "src", "content", "photos", "en");
const jaDir = path.join(root, "src", "content", "photos", "ja");

const deeplKey = process.env.DEEPL_API_KEY;
const deeplUrl =
  process.env.DEEPL_API_URL ?? "https://api-free.deepl.com/v2/translate";

const hasJapanese = (text) => /[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff]/.test(text);

async function translateToEnglish(text) {
  if (!deeplKey) {
    throw new Error("DEEPL_API_KEY is not set");
  }
  const body = new URLSearchParams();
  body.append("text", text);
  body.append("source_lang", "JA");
  body.append("target_lang", "EN");

  const response = await fetch(deeplUrl, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${deeplKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`DeepL error ${response.status}: ${message}`);
  }

  const payload = await response.json();
  const translated = payload?.translations?.[0]?.text;
  if (!translated) {
    throw new Error("DeepL returned no translation");
  }
  return translated;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\\s*\\n([\\s\\S]*?)\\n---\\s*/);
  if (!match) {
    return { data: {}, order: [], rest: text };
  }

  const body = match[1].split("\\n");
  const rest = text.slice(match[0].length);
  const data = {};
  const order = [];

  for (let i = 0; i < body.length; i += 1) {
    const line = body[i];
    if (!line.trim()) {
      continue;
    }
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\\s*(.*)$/);
    if (!keyMatch) {
      continue;
    }
    const key = keyMatch[1];
    const value = keyMatch[2];
    order.push(key);

    if (value === "|-" || value === "|" || value === ">-" || value === ">") {
      const lines = [];
      i += 1;
      while (i < body.length) {
        const next = body[i];
        if (next.startsWith("  ")) {
          lines.push(next.slice(2));
        } else if (next.startsWith("\\t")) {
          lines.push(next.slice(1));
        } else if (next === "") {
          lines.push("");
        } else {
          i -= 1;
          break;
        }
        i += 1;
      }
      data[key] = lines.join("\\n").replace(/\\n+$/, "");
    } else {
      data[key] = value.replace(/^\"|\"$/g, "");
    }
  }

  return { data, order, rest };
}

function buildFrontmatter(data, order, rest) {
  const preferred = ["title", "photo", "caption", "publish-date"];
  const keys = [];
  for (const key of preferred) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keys.push(key);
    }
  }
  for (const key of order) {
    if (!keys.includes(key) && Object.prototype.hasOwnProperty.call(data, key)) {
      keys.push(key);
    }
  }
  for (const key of Object.keys(data)) {
    if (!keys.includes(key)) {
      keys.push(key);
    }
  }

  const lines = ["---"];
  for (const key of keys) {
    const value = data[key];
    if (key === "caption") {
      lines.push("caption: |-");
      const captionLines = String(value ?? "").split("\\n");
      for (const captionLine of captionLines) {
        lines.push(`  ${captionLine}`);
      }
      continue;
    }
    lines.push(`${key}: ${value}`);
  }
  lines.push("---");
  return `${lines.join("\\n")}${rest.startsWith("\\n") ? "" : "\\n"}${rest}`;
}

async function main() {
  const enFiles = await fs.readdir(enDir);
  const updated = [];
  const skipped = [];

  for (const name of enFiles) {
    if (!name.endsWith(".md")) {
      continue;
    }

    const enPath = path.join(enDir, name);
    const jaPath = path.join(jaDir, name);

    try {
      await fs.access(jaPath);
    } catch {
      skipped.push({ name, reason: "missing-ja" });
      continue;
    }

    const enText = await fs.readFile(enPath, "utf-8");
    const jaText = await fs.readFile(jaPath, "utf-8");

    const en = parseFrontmatter(enText);
    const ja = parseFrontmatter(jaText);

    const hasTitle = Object.prototype.hasOwnProperty.call(en.data, "title");
    const hasCaption = Object.prototype.hasOwnProperty.call(en.data, "caption");
    if (hasTitle && hasCaption) {
      continue;
    }

    const title = ja.data.title;
    const caption = ja.data.caption;

    if (!title && !caption) {
      skipped.push({ name, reason: "missing-ja-title-caption" });
      continue;
    }

    if (!hasTitle && title) {
      en.data.title = title;
    }

    if (!hasCaption && caption) {
      const needsTranslation = hasJapanese(caption);
      en.data.caption = needsTranslation ? await translateToEnglish(caption) : caption;
    }

    const updatedText = buildFrontmatter(en.data, en.order, en.rest);
    await fs.writeFile(enPath, updatedText, "utf-8");
    updated.push(name);
  }

  console.log(`Updated ${updated.length} file(s).`);
  if (skipped.length) {
    console.log("Skipped:");
    for (const item of skipped) {
      console.log(`- ${item.name}: ${item.reason}`);
    }
  }
}

await main();
