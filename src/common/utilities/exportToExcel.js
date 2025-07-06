import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";

export const exportToExcel = (data, fileName = "bao-cao-cham-cong.xlsx") => {
  if (!data || data.length === 0) {
    return;
  }

  // Chuyển đổi dữ liệu
  const worksheetData = data.map((item) => ({
    "Tên nhân viên": item.user?.name || "N/A",
    "Ngày": item.checkIn ? dayjs(item.checkIn).format("DD/MM/YYYY") : "--",
    "Giờ vào": item.checkIn ? dayjs(item.checkIn).format("HH:mm") : "--",
    "Giờ ra": item.checkOut ? dayjs(item.checkOut).format("HH:mm") : "--",
    "Trạng thái": (() => {
      const status = item.status?.toUpperCase();
      const labelMap = {
        COMPLETED: "Hoàn thành",
        LATE: "Đi trễ",
        ABSENT: "Vắng mặt",
        NO_CHECKOUT: "Chưa check-out",
      };
      return labelMap[status] || "Không xác định";
    })(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(blob, fileName);
};
