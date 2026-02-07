export const getDzikir = async (type?: "pagi" | "sore" | "solat") => {
  const url = type
    ? `https://muslim-api-three.vercel.app/v1/dzikir?type=${type}`
    : `https://muslim-api-three.vercel.app/v1/dzikir`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal mengambil data dzikir");
  return res.json();
};
