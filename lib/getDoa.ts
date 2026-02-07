export async function getAllDoa() {
  const res = await fetch("https://equran.id/api/doa");
  if (!res.ok) return [];
  const result = await res.json();
  // Mengambil properti 'data' yang berisi array doa
  return result.data || [];
}
