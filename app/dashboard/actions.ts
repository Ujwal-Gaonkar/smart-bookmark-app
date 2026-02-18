"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Validates that a URL is reachable by sending a HEAD request.
 * Any HTTP response (even 403/999) proves the site exists.
 * Only rejects on connection failures or timeouts.
 */
async function validateUrl(url: string): Promise<{ valid: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    // Try HEAD first — any response means the server exists
    await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);
    // Any response at all (200, 403, 999, etc.) means the site exists
    return { valid: true };
  } catch {
    // HEAD failed entirely — try GET as fallback
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        redirect: "follow",
      });

      clearTimeout(timeout);
      return { valid: true };
    } catch {
      return { valid: false };
    }
  }
}

export async function addBookmark(url: string, title?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return { error: "Invalid URL format" };
  }

  // Validate URL is reachable
  const validation = await validateUrl(url);
  if (!validation.valid) {
    return { error: "URL is not reachable. Please check the link and try again." };
  }

  let bookmarkTitle = title;
  if (!bookmarkTitle) {
    try {
      bookmarkTitle = new URL(url).hostname;
    } catch {
      bookmarkTitle = url;
    }
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      user_id: user.id,
      url,
      title: bookmarkTitle || url,
    })
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, data };
}

export async function deleteBookmark(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBookmark(id: string, url: string, title: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return { error: "Invalid URL format" };
  }

  // Validate URL is reachable
  const validation = await validateUrl(url);
  if (!validation.valid) {
    return { error: "URL is not reachable. Please check the link and try again." };
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .update({ url, title })
    .eq("id", id)
    .eq("user_id", user.id)
    .select();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, data };
}
