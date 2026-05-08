// Match complete HTML opening/self-closing tags
const TAG_RE = /<([a-zA-Z][a-zA-Z0-9-]*)(\s[^>]*)?\/?>/gs;
const ID_RE = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))/gi;
const IN_PAGE_ANCHOR_RE = /\bhref\s*=\s*(?:"#([^"]+)"|'#([^']+)'|#([^\s"'=<>`]+))/gi;

/**
 * Tokenize attribute names + values from within a tag string.
 * Uses a state machine to avoid matching vl-* inside quoted attribute values
 * (e.g. class="vl-header vl-footer" must NOT produce vl-header/vl-footer attrs).
 */
function extractAttrsFromTag(tag, tagOffset) {
  const attrs = [];
  let i = 0;

  // Skip tag name (<tagname)
  while (i < tag.length && !/[\s>/]/.test(tag[i])) i++;

  while (i < tag.length) {
    // Skip whitespace between attributes
    while (i < tag.length && /[\s]/.test(tag[i])) i++;
    if (i >= tag.length || tag[i] === ">" || tag[i] === "/") break;

    // Read attribute name
    const nameStart = i;
    while (i < tag.length && !/[\s=>/]/.test(tag[i])) i++;
    const attrName = tag.slice(nameStart, i);

    // Skip whitespace before potential =
    while (i < tag.length && /\s/.test(tag[i])) i++;

    let attrValue = "";
    if (tag[i] === "=") {
      i++; // skip =
      while (i < tag.length && /\s/.test(tag[i])) i++;
      if (tag[i] === '"' || tag[i] === "'") {
        const quote = tag[i++];
        const valueStart = i;
        while (i < tag.length && tag[i] !== quote) i++;
        attrValue = tag.slice(valueStart, i);
        i++; // skip closing quote
      } else {
        const valueStart = i;
        while (i < tag.length && !/[\s>]/.test(tag[i])) i++;
        attrValue = tag.slice(valueStart, i);
      }
    }

    if (/^vl-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(attrName)) {
      attrs.push({ name: attrName, value: attrValue, index: tagOffset + nameStart });
    }
  }

  return attrs;
}

export function extractVlAttributes(content) {
  const attrs = [];
  const tagRe = new RegExp(TAG_RE.source, TAG_RE.flags);
  let tagMatch;

  while ((tagMatch = tagRe.exec(content))) {
    attrs.push(...extractAttrsFromTag(tagMatch[0], tagMatch.index));
  }

  return attrs;
}

export function extractIds(content) {
  const ids = new Set();
  let match;

  while ((match = ID_RE.exec(content))) {
    ids.add(match[1] ?? match[2] ?? match[3]);
  }

  return [...ids];
}

export function extractInPageAnchors(content) {
  const anchors = [];
  let match;

  while ((match = IN_PAGE_ANCHOR_RE.exec(content))) {
    anchors.push(match[1] ?? match[2] ?? match[3]);
  }

  return anchors;
}
