const BASE_URL = "https://equran.id/api";

export async function getAllSurah() {
  const res = await fetch(`${BASE_URL}/surat`);
  if (!res.ok) return [];
  return res.json();
}

export async function getDetailSurah(id: string) {
  const res = await fetch(`${BASE_URL}/surat/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getTafsirSurah(id: string) {
  const res = await fetch(`${BASE_URL}/tafsir/${id}`);
  if (!res.ok) return null;
  return res.json();
}
