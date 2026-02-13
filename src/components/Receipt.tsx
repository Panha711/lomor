"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import PrintIcon from "@mui/icons-material/Print";
import type { Sale } from "@/types/sale";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    v,
  );

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

interface ReceiptProps {
  sale: Sale;
  onClose?: () => void;
  onPrint?: () => void;
}

export default function Receipt({ sale, onClose, onPrint }: ReceiptProps) {
  const subtotal =
    sale.subtotal ?? sale.items.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = sale.discount ?? 0;

  function handlePrint() {
    const w = window.open("", "_blank");
    if (!w) return;
    const itemsHtml = sale.items
      .map(
        (line) => `
    <div class="item">
      <div class="item-name">${escapeHtml(line.name)}</div>
      <div class="item-detail">${escapeHtml(line.type)} · ${escapeHtml(line.size)} · ${escapeHtml(line.color)}</div>
      <div class="row"><span>${line.quantity} × ${fmt(line.price)}</span><span>${fmt(line.subtotal)}</span></div>
    </div>`,
      )
      .join("");
    w.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Receipt #${sale.id.slice(0, 8)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Courier New', monospace; font-size: 14px; padding: 24px; max-width: 320px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 16px; }
    .store { font-size: 22px; font-weight: bold; letter-spacing: 2px; margin-bottom: 4px; }
    .date { font-size: 12px; color: #666; }
    hr { border: none; border-top: 1px dashed #333; margin: 12px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .item { margin-bottom: 10px; }
    .item-name { font-weight: bold; margin-bottom: 2px; }
    .item-detail { font-size: 12px; color: #555; }
    .total { font-size: 18px; font-weight: bold; margin-top: 12px; padding-top: 12px; border-top: 2px solid #333; display: flex; justify-content: space-between; }
    .thanks { text-align: center; margin-top: 20px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="store">LOMOR</div>
    <div class="item-detail">Clothing Store</div>
    <div class="date">${escapeHtml(fmtDate(sale.createdAt))}</div>
    <div class="date">Receipt #${sale.id.slice(0, 8).toUpperCase()}</div>
  </div>
  <hr/>
  ${itemsHtml}
  <hr/>
  <div class="row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
  ${discount > 0 ? `<div class="row"><span>Discount</span><span>-${fmt(discount)}</span></div>` : ""}
  <div class="total"><span>TOTAL</span><span>${fmt(sale.total)}</span></div>
  <div class="thanks">Thank you for shopping with us!</div>
</body>
</html>
        `);
    w.document.close();
    w.print();
    w.close();
    onPrint?.();
  }

  return (
    <Box>
      {/* Screen view */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: 2,
          border: "0.5px solid #333",
          p: 3,
          maxWidth: 320,
          mx: "auto",
          fontFamily: "'Courier New', monospace",
          "@media print": { border: "none", boxShadow: "none" },
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
            LOMOR
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
            Clothing Store
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 1 }}>
            {fmtDate(sale.createdAt)}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            Receipt #{sale.id.slice(0, 8).toUpperCase()}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed", my: 1.5 }} />

        {sale.items.map((line, i) => (
          <Box key={i} sx={{ mb: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
              {line.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {line.type} · {line.size} · {line.color}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 0.25,
              }}
            >
              <Typography sx={{ fontSize: 12 }}>
                {line.quantity} × {fmt(line.price)}
              </Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {fmt(line.subtotal)}
              </Typography>
            </Box>
          </Box>
        ))}

        <Divider sx={{ borderStyle: "dashed", my: 1.5 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ fontSize: 12 }}>Subtotal</Typography>
          <Typography sx={{ fontSize: 12 }}>{fmt(subtotal)}</Typography>
        </Box>
        {discount > 0 && (
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography sx={{ fontSize: 12 }}>Discount</Typography>
            <Typography sx={{ fontSize: 12 }}>-{fmt(discount)}</Typography>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            pt: 1.5,
            borderTop: "2px solid #333",
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 700 }}>TOTAL</Typography>
          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>
            {fmt(sale.total)}
          </Typography>
        </Box>

        <Typography
          sx={{
            textAlign: "center",
            mt: 2,
            fontSize: 12,
            color: "text.secondary",
          }}
        >
          Thank you for shopping with us!
        </Typography>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mt: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          size="medium"
        >
          Print Receipt
        </Button>
        {onClose && (
          <Button variant="outlined" onClick={onClose} size="medium">
            Done
          </Button>
        )}
      </Box>
    </Box>
  );
}
