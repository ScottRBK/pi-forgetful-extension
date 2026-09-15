/** Qualified repository identity, including GitLab subgroups and self-hosted prefixes. */
export function repositoryName(value: string): string {
  const name = typeof value === "string" ? value.trim() : "";
  const parts = name.split("/");
  if (!name || name.length > 255 || parts.length < 2 ||
      parts.some((part) => !part || part === "." || part === ".." || /[\s:?#]/.test(part))) {
    throw new TypeError("repo_name must use owner/repo format, with non-empty path segments " +
      "and at most 255 characters. GitLab subgroups and self-hosted prefixes are supported.");
  }
  return name;
}
