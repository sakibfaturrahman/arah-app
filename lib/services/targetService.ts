export interface DailyTarget {
  date: string; // Format: YYYY-MM-DD
  sholat5Waktu: { [key: string]: boolean }; // { subuh: true, dhuhur: false, ... }
  tarawih: boolean;
  puasa: boolean;
  tilawahLembar: number;
}

export const saveDailyProgress = (data: DailyTarget) => {
  const existing = localStorage.getItem("mutabaah-data");
  const allData = existing ? JSON.parse(existing) : {};
  allData[data.date] = data;
  localStorage.setItem("mutabaah-data", JSON.stringify(allData));
};

export const getDailyProgress = (date: string): DailyTarget => {
  const existing = localStorage.getItem("mutabaah-data");
  const allData = existing ? JSON.parse(existing) : {};
  return (
    allData[date] || {
      date,
      sholat5Waktu: {
        subuh: false,
        dhuhur: false,
        ashar: false,
        maghrib: false,
        isya: false,
      },
      tarawih: false,
      puasa: false,
      tilawahLembar: 0,
    }
  );
};
