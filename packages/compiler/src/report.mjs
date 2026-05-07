export function createMarkdownReport(results, totals) {
  const lines = [];

  lines.push("# Velora Motion Compiler Report");
  lines.push("");
  lines.push(`- Files scanned: **${totals.files}**`);
  lines.push(`- Velora attributes found: **${totals.attrs}**`);
  lines.push(`- Issues found: **${totals.issues}**`);
  lines.push("");

  for (const result of results) {
    const status = result.issues.length ? "FAIL" : "OK";
    lines.push(`## ${status} — \`${result.file}\``);
    lines.push("");

    if (result.attrs.length) {
      lines.push("### Attributes");
      for (const attr of result.attrs) {
        const value = attr.value ? `=\"${attr.value}\"` : "";
        lines.push(`- \`${attr.name}${value}\``);
      }
      lines.push("");
    }

    if (result.issues.length) {
      lines.push("### Issues");
      for (const issue of result.issues) {
        lines.push(`- **${issue.type}**: ${issue.message}`);
      }
      lines.push("");
    }
  }

  return `${lines.join("\n")}\n`;
}
