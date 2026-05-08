const EFFECT_RE = /^(?<name>[a-z0-9][a-z0-9-]*)(?:@(?<duration>\d*\.?\d+m?s|var\(--[a-z0-9-]+\)))?(?:\/(?<ease>[a-z0-9-]+|cubic-bezier\([^)]*\)))?$/i;
const FUNCTION_RE = /(?<name>[a-z][a-z0-9-]*)\((?<args>[^)]*)\)/gi;
const DECL_RE = /(?:^|\s)(?<key>[a-z][a-z0-9-]*):(?<value>[^\s]+)/gi;

function parseFunctionScopedPreset(token) {
  const scopedMatch = /^(?<preset>[a-z0-9][a-z0-9-]*):(?<fn>[a-z][a-z0-9-]*\([^)]*\))$/i.exec(token);
  return scopedMatch?.groups ?? null;
}

export function parseMotionValue(value = "") {
  const trimmed = value.trim();
  const result = {
    raw: value,
    preset: "",
    duration: "",
    ease: "",
    functions: [],
    declarations: {},
    tokens: [],
  };

  if (!trimmed) return result;

  const [firstToken, ...restTokens] = trimmed.split(/\s+/);
  const scopedPreset = parseFunctionScopedPreset(firstToken);
  const effectMatch = scopedPreset ? null : EFFECT_RE.exec(firstToken);

  if (scopedPreset) {
    result.preset = scopedPreset.preset;
  } else if (effectMatch?.groups) {
    result.preset = effectMatch.groups.name ?? "";
    result.duration = effectMatch.groups.duration ?? "";
    result.ease = effectMatch.groups.ease ?? "";
  } else {
    result.preset = firstToken;
  }

  let functionMatch;
  while ((functionMatch = FUNCTION_RE.exec(trimmed))) {
    result.functions.push({
      name: functionMatch.groups.name,
      args: functionMatch.groups.args.split(",").map((arg) => arg.trim()).filter(Boolean),
    });
  }

  const declarationSource = restTokens.join(" ");
  let declarationMatch;
  while ((declarationMatch = DECL_RE.exec(declarationSource))) {
    result.declarations[declarationMatch.groups.key] = declarationMatch.groups.value;
  }

  result.tokens = [firstToken, ...restTokens];
  return result;
}
