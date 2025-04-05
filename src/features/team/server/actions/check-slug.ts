"use server";

import * as api from "../api";

export async function checkSlug(slug?: string) {
  return await api.checkSlug(slug);
}
