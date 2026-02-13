"use client";

import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DownloadIcon from "@mui/icons-material/Download";
import { getSales } from "@/lib/sales-api";
import Receipt from "@/components/Receipt";
import type { Sale } from "@/types/sale";

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v);

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

export default function ReportsPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const paginatedSales = useMemo(() => {
    const start = page * rowsPerPage;
    return sales.slice(start, start + rowsPerPage);
  }, [sales, page, rowsPerPage]);

  useEffect(() => {
    setSales(getSales());
  }, [receiptSale]);

  useEffect(() => {
    if (sales.length > 0 && page * rowsPerPage >= sales.length) {
      setPage(Math.max(0, Math.ceil(sales.length / rowsPerPage) - 1));
    }
  }, [sales.length, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function exportCSV() {
    const freshSales = getSales();
    if (!freshSales.length) return;
    const rows = [["Date & time", "Items", "Qty", "Total"]];
    freshSales.forEach((s) => {
      const dateTime = fmtDate(s.createdAt);
      const items = s.items.map((i) => i.name).join(", ");
      const qty = String(s.items.reduce((sum, i) => sum + i.quantity, 0));
      const total = fmtMoney(s.total);
      rows.push([dateTime, items, qty, total]);
    });
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setSales(freshSales);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, mb: 0.25 }}
          >
            Reports
          </Typography>
          <Typography variant="body2">Inventory insights</Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          startIcon={<DownloadIcon fontSize="small" />}
          onClick={exportCSV}
        >
          Export CSV
        </Button>
      </Box>
      {/* Sales when customer sell */}
      <Section title="">
        {sales.length === 0 ? (
          <Empty text="No sales yet." />
        ) : (
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <TableContainer
              component="div"
              sx={
                rowsPerPage > 10 || paginatedSales.length > 10
                  ? { maxHeight: 560, overflow: "auto" }
                  : undefined
              }
            >
              <Table
                stickyHeader
                size="medium"
                sx={{
                  "& .MuiTableCell-root": {
                    padding: "10px 12px",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Date & time</TableCell>
                    <TableCell>Receipt</TableCell>
                    <TableCell>Items</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.id} hover>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {fmtDate(sale.createdAt)}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: 12 }}>
                        #{sale.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        {sale.items.map((i) => i.name).join(", ")}
                      </TableCell>
                      <TableCell>
                        {sale.items.reduce((sum, i) => sum + i.quantity, 0)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        {fmtMoney(sale.total)}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => setReceiptSale(sale)}
                        >
                          Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={sales.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Rows:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} of ${count}`
              }
              sx={{
                borderTop: 1,
                borderColor: "divider",
                width: "100%",
                flexShrink: 0,
                "& .MuiTablePagination-toolbar": {
                  width: "100%",
                  justifyContent: "center",
                  paddingLeft: 0,
                  paddingRight: 0,
                },
                "& .MuiTablePagination-spacer": {
                  display: "none",
                },
                "& .MuiTablePagination-actions": {
                  marginLeft: 0,
                },
              }}
            />
          </Paper>
        )}
      </Section>

      {/* Receipt Dialog */}
      <Dialog
        open={!!receiptSale}
        onClose={() => setReceiptSale(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { p: 2 } }}
      >
        {receiptSale && (
          <Receipt sale={receiptSale} onClose={() => setReceiptSale(null)} />
        )}
      </Dialog>
    </>
  );
}

/* ---- Helpers ---- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Typography variant="h3" sx={{ fontSize: 15, mb: 1.5 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function Empty({ text = "No data." }: { text?: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
      <Typography color="text.secondary" sx={{ fontSize: 13 }}>
        {text}
      </Typography>
    </Paper>
  );
}
