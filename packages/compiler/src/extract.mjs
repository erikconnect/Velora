const VL_ATTRIBUTE_RE = /(?<=\s)(vl-[a-z0-9]+(?:-[a-z0-9]+)*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/gi;
const ID_RE = /\bid\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s"'=<>`]+))/gi;
const IN_PAGE_ANCHOR_RE = /\bhref\s*=\s*(?:"#([^"]+)"|'#([^']+)'|#([^\s"'=<>`]+))/gi;

export function extractVlAttributes(content) {
  const attrs = [];
  let match;

  while ((match = VL_ATTRIBUTE_RE.exec(content))) {
    attrs.push({
      name: match[1],
      value: match[2] ?? match[3] ?? match[4] ?? "",
      index: match.index,
    });
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
