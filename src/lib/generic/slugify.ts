export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/[''"]+/g, "")
    .replace(/[^a-z0-9\-_]+/g, "-")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function generateUniqueSlug(
  text: string,
  existingSlug?: string
): string {
  const baseSlug = slugify(text);

  if (!existingSlug) {
    return baseSlug;
  }

  const randomString = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${randomString}`;
}
