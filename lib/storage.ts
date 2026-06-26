import { createClient } from "@supabase/supabase-js";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase storage is not configured");
  }

  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

export async function uploadImage(file: File, folder: "logos" | "screenshots") {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error("Only PNG, JPG, and WebP images are supported");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image must be 5MB or smaller");
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is not configured");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const bytes = await file.arrayBuffer();
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type,
    upsert: false
  });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
