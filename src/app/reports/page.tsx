"use client";

import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
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
import SearchIcon from "@mui/icons-material/Search";
import { getSales } from "@/lib/sales-api";
import Receipt from "@/components/Receipt";
import { CLOTHING_TYPES, CLOTHING_COLORS } from "@/types/clothes";
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
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");

  const filteredSales = useMemo(() => {
    let list = sales;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.items.some((i) => i.name.toLowerCase().includes(q)),
      );
    }
    if (typeFilter !== "all") {
      list = list.filter((s) => s.items.some((i) => i.type === typeFilter));
    }
    if (colorFilter !== "all") {
      list = list.filter((s) => s.items.some((i) => i.color === colorFilter));
    }
    return list;
  }, [sales, search, typeFilter, colorFilter]);

  const paginatedSales = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSales.slice(start, start + rowsPerPage);
  }, [filteredSales, page, rowsPerPage]);

  useEffect(() => {
    setSales(getSales());
  }, [receiptSale]);

  useEffect(() => {
    if (
      filteredSales.length > 0 &&
      page * rowsPerPage >= filteredSales.length
    ) {
      setPage(Math.max(0, Math.ceil(filteredSales.length / rowsPerPage) - 1));
    }
  }, [filteredSales.length, page, rowsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [search, typeFilter, colorFilter]);

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
    if (!filteredSales.length) return;
    const rows = [["Date & time", "Receipt", "Items", "Qty", "Total"]];
    filteredSales.forEach((s) => {
      const dateTime = fmtDate(s.createdAt);
      const receipt = `#${s.id.slice(0, 8).toUpperCase()}`;
      const items = s.items.map((i) => i.name).join(", ");
      const qty = String(s.items.reduce((sum, i) => sum + i.quantity, 0));
      const total = fmtMoney(s.total);
      rows.push([dateTime, receipt, items, qty, total]);
    });
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
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

      {/* Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{ mb: 2 }}
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: { sm: 1 }, minWidth: { sm: 180 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={typeFilter}
              label="Type"
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {CLOTHING_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Color</InputLabel>
            <Select
              value={colorFilter}
              label="Color"
              onChange={(e) => setColorFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {CLOTHING_COLORS.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Sales when customer sell */}
      <Section title="">
        {sales.length === 0 ? (
          <Empty text="No sales yet." />
        ) : filteredSales.length === 0 ? (
          <Empty text="No matches." />
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
              count={filteredSales.length}
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
