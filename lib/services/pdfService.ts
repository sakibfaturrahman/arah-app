// lib/services/pdfService.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface PDFParams {
  schedule: any[];
  userCity: string;
  namaBulan: string;
  hijriDate: string;
  fullAddress: string;
}

const getBase64ImageFromURL = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (error) => reject(error);
  });
};

const mapDayIndo = (enDay: string) => {
  const days: { [key: string]: string } = {
    Sun: "Min",
    Mon: "Sen",
    Tue: "Sel",
    Wed: "Rab",
    Thu: "Kam",
    Fri: "Jum",
    Sat: "Sab",
  };
  return days[enDay] || enDay;
};

export const generatePrayerSchedulePDF = async ({
  schedule,
  userCity,
  namaBulan,
  hijriDate,
  fullAddress,
}: PDFParams) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Definisi Variabel Warna agar tidak error
  const primaryColor: [number, number, number] = [84, 101, 255];
  const textColor: [number, number, number] = [30, 41, 59];
  const grayColor: [number, number, number] = [148, 163, 184];
  const secondaryColor: [number, number, number] = [100, 116, 139]; // Tambahkan ini

  try {
    try {
      const logoData = await getBase64ImageFromURL("/logo.jpg");
      doc.addImage(logoData, "JPEG", 15, 10, 30, 30);
    } catch (e) {
      console.warn("Logo tidak ditemukan");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text("Pendamping Ibadah Digital", 17, 34);

    // 2. Garis Vertikal Pemisah (Tipis)
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(60, 15, 60, 32);

    // 3. Tengah: Info Jadwal (Sejajar Logo)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(`Jadwal sholat bulan ${namaBulan}`, 65, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    const cleanedHijri = hijriDate.replace(/[^\x20-\x7E]/g, "");
    doc.text(`${userCity} dan sekitarnya  •  ${cleanedHijri}`, 65, 28);

    // Garis Horizontal Header
    doc.setDrawColor(241, 245, 249);
    doc.line(15, 38, 195, 38);

    const tableColumn = [
      "Tanggal",
      "Imsak",
      "Subuh",
      "Terbit",
      "Dzuhur",
      "Ashar",
      "Maghrib",
      "Isya",
    ];

    const tableRows = schedule.map((day) => [
      `${day.date.gregorian.day} ${mapDayIndo(day.date.gregorian.weekday.en.slice(0, 3))}`,
      day.timings.Imsak.split(" ")[0],
      day.timings.Fajr.split(" ")[0],
      day.timings.Sunrise.split(" ")[0],
      day.timings.Dhuhr.split(" ")[0],
      day.timings.Asr.split(" ")[0],
      day.timings.Maghrib.split(" ")[0],
      day.timings.Isha.split(" ")[0],
    ]);

    autoTable(doc, {
      startY: 45,
      head: [tableColumn],
      body: tableRows,
      theme: "grid", // Menggunakan tema grid untuk garis row dan column
      styles: {
        halign: "center",
        fontSize: 8.5,
        font: "helvetica",
        cellPadding: 2.5,
        textColor: textColor,
        lineColor: [230, 230, 230], // Warna garis tabel (abu-abu muda)
        lineWidth: 0.1, // Ketebalan garis
      },
      headStyles: {
        fillColor: [255, 255, 255], // Background header putih
        textColor: primaryColor,
        fontStyle: "bold",
        lineWidth: { bottom: 0.5 }, // Garis bawah header lebih tebal
        lineColor: primaryColor,
      },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" }, // Kolom tanggal rata kiri
      },
      didParseCell: (data) => {
        // Warnai Merah untuk Hari Minggu
        if (data.column.index === 0 && data.cell.text[0].includes("Min")) {
          data.cell.styles.textColor = [239, 68, 68];
        }
      },
      alternateRowStyles: {
        fillColor: [252, 253, 255], // Warna selang-seling baris yang sangat tipis
      },
      margin: { horizontal: 15 },
    });

    // --- FOOTER ---
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(7);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);

    const printDate = new Date()
      .toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(/\./g, ":");

    doc.text(`Dicetak pada: ${printDate} melalui nalarah.my.id`, 105, finalY, {
      align: "center",
    });

    doc.setFont("helvetica", "italic");
    doc.text(
      "“Tegakkanlah sholat, sesungguhnya sholat itu mencegah perbuatan keji dan mungkar.”",
      105,
      finalY + 5,
      { align: "center" },
    );

    const safeFileName = `Jadwal_Sholat_${userCity.replace(/\s+/g, "_")}_${namaBulan.replace(/\s+/g, "_")}.pdf`;
    doc.save(safeFileName);
  } catch (error) {
    console.error("Gagal membuat PDF:", error);
  }
};
