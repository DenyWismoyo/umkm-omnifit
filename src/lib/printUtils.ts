import { IncomingOrder } from "@/types";

export function handlePrintKitchenTicket(order: IncomingOrder) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>TIKET DAPUR #${order.orderNumber}</title>
        <style>
          body { font-family: monospace; padding: 10px; width: 280px; font-size: 13px; line-height: 1.4; }
          .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 16px; font-weight: bold; }
          .table { font-size: 18px; font-weight: bold; background: #000; color: #fff; padding: 2px 6px; display: inline-block; margin: 4px 0; }
          .item { margin-bottom: 6px; }
          .item-name { font-weight: bold; }
          .item-notes { font-style: italic; color: #333; margin-left: 10px; }
          .footer { border-top: 1px dashed #000; padding-top: 6px; margin-top: 10px; text-align: center; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">TIKET PESANAN DAPUR</div>
          <div class="table">${order.tableNumber.toUpperCase()}</div>
          <div>#${order.orderNumber} • ${order.customerName}</div>
          <div>${new Date(order.createdAt).toLocaleTimeString()}</div>
        </div>
        <div class="items">
          ${order.items
            .map(
              (it) => `
            <div class="item">
              <div class="item-name">${it.quantity}x ${it.productName}</div>
              ${it.notes ? `<div class="item-notes">↳ ${it.notes}</div>` : ""}
            </div>
          `
            )
            .join("")}
        </div>
        ${
          order.generalNotes
            ? `<div style="margin-top:8px; border-top:1px dotted #000; padding-top:4px;"><b>Catatan:</b> ${order.generalNotes}</div>`
            : ""
        }
        <div class="footer">
          Harap segera diproses oleh Barista / Koki.
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
}
