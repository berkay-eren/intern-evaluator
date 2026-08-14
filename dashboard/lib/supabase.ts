import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Okuma istemcisi. anon anahtari herkese acik olabilir; tablolardaki RLS
 * politikasi sadece `select` izni verdigi icin bu anahtarla yazma yapilamaz.
 *
 * Istemci modul yuklenirken degil, ilk kullanimda kuruluyor: boylece ortam
 * degiskenleri eksikken `next build` patlamiyor, hata istek aninda cikiyor.
 */
export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanimli degil. .env.local dosyasini kontrol et."
    );
  }

  cached = createClient(url, anonKey);
  return cached;
}

/**
 * CV dosyalari private bir bucket'ta duruyor. Imzali (sureli) indirme baglantisini
 * yalnizca sunucu tarafinda, service_role anahtariyla uretiyoruz.
 * Bu anahtarin adinda NEXT_PUBLIC_ yok, bu yuzden Next.js onu istemci paketine
 * dahil etmez -- tarayiciya hicbir zaman gitmez.
 */
export async function createCvSignedUrl(
  cvUrl: string | null,
  expiresInSeconds = 600
): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!cvUrl || !url || !serviceRoleKey) return null;

  // `cv_url` bucket adiyla birlikte tutuluyor: "cvs/17.pdf"
  const [bucket, ...rest] = cvUrl.split("/");
  const path = rest.join("/");
  if (!bucket || !path) return null;

  const admin = createClient(url, serviceRoleKey);
  const { data, error } = await admin.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    console.error("Imzali CV baglantisi uretilemedi:", error.message);
    return null;
  }
  return data.signedUrl;
}
