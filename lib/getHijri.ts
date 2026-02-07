export async function getHijriDate() {
  // Ambil tanggal hari ini dalam format DD-MM-YYYY
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  const dateString = `${day}-${month}-${year}`;

  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/gToH/${dateString}`,
    );
    const result = await response.json();

    if (result.code === 200) {
      const data = result.data.hijri;
      // Mengembalikan objek yang rapi: "18 Syaban 1446"
      return `${data.day} ${data.month.en} ${data.year} H`;
    }
    return null;
  } catch (error) {
    console.error("Gagal mengambil data Hijriah:", error);
    return null;
  }
}
