import dayjs from "dayjs";

export const printReport = (data, title = "Báo cáo chấm công", statistics = null) => {
  if (!data || data.length === 0) {
    alert("Không có dữ liệu để in");
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @media print {
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #1890ff;
          padding-bottom: 10px;
        }

        .logo {
          max-width: 100px;
          margin-bottom: 10px;
        }

        .title {
          color: #1890ff;
          font-size: 24px;
          margin: 0;
        }

        .sub-info {
          font-size: 12px;
          color: #666;
        }

        .statistics {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 6px;
        }

        .stat-item {
          text-align: center;
          flex: 1;
        }

        .stat-number {
          font-size: 20px;
          font-weight: bold;
          color: #1890ff;
        }

        .stat-label {
          font-size: 12px;
          color: #777;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }

        th {
          background-color: #1890ff;
          color: white;
        }

        tr:nth-child(even) {
          background-color: #fafafa;
        }

        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-completed {
          background-color: #f6ffed;
          color: #52c41a;
          border: 1px solid #b7eb8f;
        }

        .status-late {
          background-color: #fff7e6;
          color: #fa8c16;
          border: 1px solid #ffd591;
        }

        .status-absent {
          background-color: #fff2f0;
          color: #ff4d4f;
          border: 1px solid #ffb3b3;
        }

        .status-no-checkout {
          background-color: #fff1f0;
          color: #fa541c;
          border: 1px solid #ffa39e;
        }

        .status-unknown {
          background-color: #f5f5f5;
          color: #666;
          border: 1px solid #d9d9d9;
        }

        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 40px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="Logo Công ty" />
        <h1 class="title">${title}</h1>
        <p class="sub-info">Ngày in báo cáo: ${dayjs().format("DD/MM/YYYY HH:mm")}</p>
        <p class="sub-info">Tổng số bản ghi: ${data.length}</p>
      </div>

      ${statistics ? `
        <div class="statistics">
          <div class="stat-item">
            <div class="stat-number">${statistics.total}</div>
            <div class="stat-label">Tổng bản ghi</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${statistics.present}</div>
            <div class="stat-label">Có mặt</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${statistics.late}</div>
            <div class="stat-label">Đi trễ</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${statistics.absent}</div>
            <div class="stat-label">Vắng mặt</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${statistics.noCheckout || 0}</div>
            <div class="stat-label">Chưa check-out</div>
          </div>
        </div>
      ` : ''}

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên nhân viên</th>
            <th>Ngày</th>
            <th>Giờ vào</th>
            <th>Giờ ra</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((item, index) => {
            const status = item.status?.toUpperCase();
            let statusText = "Không xác định";
            let statusClass = "status-unknown";

            const labelMap = {
              COMPLETED: { text: "Hoàn thành", class: "status-completed" },
              LATE: { text: "Đi trễ", class: "status-late" },
              ABSENT: { text: "Vắng mặt", class: "status-absent" },
              NO_CHECKOUT: { text: "Chưa check-out", class: "status-no-checkout" },
            };

            if (labelMap[status]) {
              statusText = labelMap[status].text;
              statusClass = labelMap[status].class;
            }

            return `
              <tr>
                <td>${index + 1}</td>
                <td>${item.user?.name || "N/A"}</td>
                <td>${item.checkIn ? dayjs(item.checkIn).format("DD/MM/YYYY") : "--"}</td>
                <td>${item.checkIn ? dayjs(item.checkIn).format("HH:mm") : "--"}</td>
                <td>${item.checkOut ? dayjs(item.checkOut).format("HH:mm") : "--"}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>

      <div class="footer">
        Báo cáo được tạo bởi hệ thống chấm công<br />
        © ${dayjs().format("YYYY")} Công ty bạn - Mọi quyền được bảo lưu
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.close();
  };
};
