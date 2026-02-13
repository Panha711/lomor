"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import ClothesForm from "@/components/ClothesForm";
import Receipt from "@/components/Receipt";
import {
  getClothes,
  deleteClothing,
  createClothing,
  updateClothing,
} from "@/lib/clothes-api";
import { createSale } from "@/lib/sales-api";
import { CLOTHING_TYPES, CLOTHING_COLORS } from "@/types/clothes";
import type { ClothingItem, ClothingFormData } from "@/types/clothes";
import type { Sale } from "@/types/sale";

const COLOR_HEX: Record<string, string> = {
  Black: "#000",
  White: "#fff",
  Red: "#ef4444",
  Blue: "#3b82f6",
  Navy: "#1e3a5f",
  Green: "#22c55e",
  Yellow: "#eab308",
  Orange: "#f97316",
  Purple: "#a855f7",
  Pink: "#ec4899",
  Brown: "#92400e",
  Grey: "#6b7280",
  Beige: "#d2b48c",
  Cream: "#fffdd0",
  Maroon: "#800000",
  Teal: "#14b8a6",
};

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    v,
  );

export default function ClothesListPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dialogFull = useMediaQuery(theme.breakpoints.down("md"));

  const [items, setItems] = useState<ClothingItem[]>([]);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<ClothingItem | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<ClothingItem | null>(null);
  const [sellItem, setSellItem] = useState<ClothingItem | null>(null);
  const [sellQty, setSellQty] = useState(1);
  const [sellDiscount, setSellDiscount] = useState(0);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [detailItem, setDetailItem] = useState<ClothingItem | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(() => {
    getClothes().then(setItems);
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.type.toLowerCase().includes(q) &&
        !item.color.toLowerCase().includes(q)
      )
        return false;
      if (stockFilter === "in-stock" && item.quantity <= 0) return false;
      if (stockFilter === "out-of-stock" && item.quantity > 0) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (colorFilter !== "all" && item.color !== colorFilter) return false;
      return true;
    });
  }, [items, search, stockFilter, typeFilter, colorFilter]);

  const paginatedFiltered = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  useEffect(() => {
    if (filtered.length > 0 && page * rowsPerPage >= filtered.length) {
      setPage(Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1));
    }
  }, [filtered.length, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  async function handleDelete() {
    if (!deleteTarget) return;
    await deleteClothing(deleteTarget.id);
    setDeleteTarget(null);
    load();
  }

  async function handleAdd(data: ClothingFormData) {
    await createClothing(data);
    setAddOpen(false);
    load();
  }

  async function handleEdit(data: ClothingFormData) {
    if (!editItem) return;
    await updateClothing(editItem.id, data);
    setEditItem(null);
    load();
  }

  async function handleSell() {
    if (!sellItem || sellQty < 1 || sellQty > sellItem.quantity) return;
    const subtotal = sellItem.price * sellQty;
    const discount = Math.min(sellDiscount, subtotal);
    const sale = await createSale(
      [{ itemId: sellItem.id, quantity: sellQty }],
      { discount },
    );
    setSellItem(null);
    setSellQty(1);
    setSellDiscount(0);
    load();
    if (sale) setReceiptSale(sale);
  }

  return (
    <>
      {/* Header */}
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
            Clothes List
          </Typography>
          <Typography variant="body2">{items.length} items</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="medium"
          onClick={() => setAddOpen(true)}
        >
          Add Clothes
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
            <InputLabel>Stock</InputLabel>
            <Select
              value={stockFilter}
              label="Stock"
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="in-stock">In Stock</MenuItem>
              <MenuItem value="out-of-stock">Out</MenuItem>
            </Select>
          </FormControl>
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
      {/* Content */}
      {filtered.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 5, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ fontSize: 14 }}>
            {items.length === 0
              ? 'No clothes yet. Click "Add Clothes" to start.'
              : "No matches."}
          </Typography>
        </Paper>
      ) : isMobile ? (
        <>
          <Box
            sx={
              rowsPerPage > 10 || paginatedFiltered.length > 10
                ? { maxHeight: "70vh", overflowY: "auto", overflowX: "hidden" }
                : undefined
            }
          >
            <Grid container spacing={1}>
            {paginatedFiltered.map((item) => (
              <Grid key={item.id} size={12}>
                <Card
                  variant="outlined"
                  onClick={() => setDetailItem(item)}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent sx={{ pb: 0.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "flex-start",
                        mb: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          bgcolor: "action.hover",
                          overflow: "hidden",
                          flexShrink: 0,
                        }}
                      >
                        {item.image_url ? (
                          <Box
                            component="img"
                            src={item.image_url}
                            alt=""
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const t = e.target as HTMLImageElement;
                              t.style.display = "none";
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 10,
                              color: "text.secondary",
                            }}
                          >
                            No img
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle2">
                            {item.name}
                          </Typography>
                        </Box>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          flexWrap="wrap"
                          useFlexGap
                          sx={{ mt: 0.5 }}
                        >
                          <Chip
                            label={item.type}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 11, height: 22 }}
                          />
                          <Chip
                            label={item.size}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 11, height: 22 }}
                          />
                          <Chip
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: 11, height: 22 }}
                            label={item.color}
                            icon={
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  bgcolor: COLOR_HEX[item.color] ?? "#ccc",
                                  border: "1px solid #ddd",
                                  ml: 0.5,
                                }}
                              />
                            }
                          />
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: 12, mt: 0.75 }}
                        >
                          {item.price_old != null && item.price_old > 0
                            ? `${fmt(item.price_old)} → ${fmt(item.price)} · Qty ${item.quantity}`
                            : `${fmt(item.price)} · Qty ${item.quantity}`}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                  <CardActions
                    sx={{ pt: 0, px: 1.5, pb: 1 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.quantity > 0 && (
                      <Button
                        size="small"
                        color="success"
                        startIcon={<PointOfSaleIcon sx={{ fontSize: 16 }} />}
                        onClick={() => {
                          setSellItem(item);
                          setSellQty(1);
                          setSellDiscount(0);
                        }}
                      >
                        Sell
                      </Button>
                    )}
                    <Button
                      size="small"
                      startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setEditItem(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                      onClick={() => setDeleteTarget(item)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          </Box>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 8, 10, 25, 50]}
            labelRowsPerPage="Rows:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} of ${count}`
            }
            sx={{
              borderTop: 1,
              borderColor: "divider",
              width: "100%",
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
        </>
      ) : (
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <TableContainer
            component="div"
            sx={
              rowsPerPage > 10 || paginatedFiltered.length > 10
                ? { maxHeight: 560, overflow: "auto" }
                : undefined
            }
          >
            <Table
              stickyHeader
              size="small"
              sx={{
                tableLayout: "fixed",
                width: "100%",
                "& .MuiTableCell-root": {
                  padding: "10px 12px",
                },
              }}
            >
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 56 }}>Image</TableCell>
                <TableCell sx={{ width: "20%", minWidth: 100 }}>Name</TableCell>
                <TableCell sx={{ width: 90 }}>Type</TableCell>
                <TableCell sx={{ width: 72 }}>Size</TableCell>
                <TableCell sx={{ width: 70 }}>Color</TableCell>
                <TableCell sx={{ width: 80, textAlign: "right" }}>
                  Price old
                </TableCell>
                <TableCell sx={{ width: 80, textAlign: "right" }}>
                  Price
                </TableCell>
                <TableCell sx={{ width: 56, textAlign: "right" }}>
                  Qty
                </TableCell>
                <TableCell sx={{ width: 112, textAlign: "center" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFiltered.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  onClick={() => setDetailItem(item)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ width: 56, verticalAlign: "middle" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        bgcolor: "action.hover",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      {item.image_url ? (
                        <Box
                          component="img"
                          src={item.image_url}
                          alt=""
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            t.style.display = "none";
                            const fallback =
                              t.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <Box
                        sx={{
                          display: item.image_url ? "none" : "flex",
                          width: "100%",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "text.secondary",
                          position: item.image_url ? "absolute" : "relative",
                          inset: 0,
                        }}
                      >
                        No img
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {item.type}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {item.size}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: COLOR_HEX[item.color] ?? "#ccc",
                          border: "1px solid #ddd",
                          flexShrink: 0,
                        }}
                      />
                      {item.color}
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {item.price_old != null && item.price_old > 0
                      ? fmt(item.price_old)
                      : "—"}
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                    {fmt(item.price)}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell
                    align="center"
                    sx={{ whiteSpace: "nowrap" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.quantity > 0 && (
                      <Tooltip title="Sell">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => {
                            setSellItem(item);
                            setSellQty(1);
                            setSellDiscount(0);
                          }}
                        >
                          <PointOfSaleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setEditItem(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteTarget(item)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 8, 10, 25, 50]}
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

      {/* Detail View Dialog */}
      <Dialog
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 24px 48px rgba(0,0,0,0.12)",
          },
        }}
      >
        {detailItem && (
          <>
            <Box
              sx={{
                background:
                  "linear-gradient(135deg, rgba(168, 92, 50, 0.08) 0%, rgba(168, 92, 50, 0.02) 100%)",
                px: 2.5,
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  fontSize: 11,
                  letterSpacing: 1.2,
                  color: "text.secondary",
                  fontWeight: 600,
                }}
              >
                Item details
              </Typography>
              <IconButton
                size="small"
                onClick={() => setDetailItem(null)}
                aria-label="Close"
                sx={{
                  bgcolor: "rgba(0,0,0,0.04)",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <DialogContent sx={{ p: 0 }}>
              <Box sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2.5,
                    alignItems: { xs: "center", sm: "stretch" },
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      aspectRatio: "1",
                      maxHeight: { sm: 280 },
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {detailItem.image_url ? (
                      <Box
                        component="img"
                        src={detailItem.image_url}
                        alt=""
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.style.display = "none";
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "grey.100",
                          color: "text.secondary",
                          fontSize: 14,
                        }}
                      >
                        No image
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        mb: 2,
                        color: "text.primary",
                      }}
                    >
                      {detailItem.name}
                    </Typography>
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Type
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {detailItem.type}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Size
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {detailItem.size}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Color
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: COLOR_HEX[detailItem.color] ?? "#ccc",
                              border: "2px solid",
                              borderColor: "grey.300",
                            }}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {detailItem.color}
                          </Typography>
                        </Box>
                      </Box>
                      {detailItem.price_old != null && detailItem.price_old > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 1,
                            px: 1.5,
                            borderRadius: 1,
                            bgcolor: "grey.50",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Price old
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {fmt(detailItem.price_old)}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Price
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          color="primary.main"
                        >
                          {fmt(detailItem.price)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Quantity
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {detailItem.quantity}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          py: 1,
                          px: 1.5,
                          borderRadius: 1,
                          bgcolor: "grey.50",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={
                            detailItem.quantity === 0
                              ? "Out of stock"
                              : detailItem.quantity <= 5
                                ? "Low stock"
                                : "In stock"
                          }
                          size="small"
                          color={
                            detailItem.quantity === 0
                              ? "error"
                              : detailItem.quantity <= 5
                                ? "warning"
                                : "success"
                          }
                          sx={{
                            fontWeight: 600,
                            fontSize: 12,
                            height: 26,
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        fullScreen={dialogFull}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Add New Clothes
          <IconButton size="small" onClick={() => setAddOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <ClothesForm
            onSubmit={handleAdd}
            submitLabel="Add to Inventory"
            onCancel={() => setAddOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editItem}
        onClose={() => setEditItem(null)}
        fullScreen={dialogFull}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          Edit Clothes
          <IconButton size="small" onClick={() => setEditItem(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {editItem && (
            <ClothesForm
              key={editItem.id}
                initialData={{
                name: editItem.name,
                type: editItem.type,
                size: editItem.size,
                color: editItem.color,
                price: editItem.price,
                price_old: editItem.price_old,
                quantity: editItem.quantity,
                image_url: editItem.image_url,
              }}
              onSubmit={handleEdit}
              submitLabel="Save Changes"
              onCancel={() => setEditItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete &quot;{deleteTarget?.name}&quot;? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sell Dialog */}
      <Dialog
        open={!!sellItem}
        onClose={() => setSellItem(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Sell Item</DialogTitle>
        <DialogContent>
          {sellItem && (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {sellItem.name} · {fmt(sellItem.price)} each
              </Typography>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                value={sellQty}
                onChange={(e) =>
                  setSellQty(
                    Math.min(
                      sellItem.quantity,
                      Math.max(1, parseInt(e.target.value, 10) || 1),
                    ),
                  )
                }
                slotProps={{
                  htmlInput: { min: 1, max: sellItem.quantity },
                }}
                helperText={`Max ${sellItem.quantity} in stock`}
              />
              <TextField
                label="Discount"
                type="number"
                fullWidth
                value={sellDiscount}
                onChange={(e) =>
                  setSellDiscount(Math.max(0, parseFloat(e.target.value) || 0))
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  },
                  htmlInput: { min: 0, step: 0.01 },
                }}
                helperText={`Subtotal: ${fmt(sellItem.price * sellQty)}`}
                sx={{ mt: 2 }}
              />
              <Typography variant="body2" sx={{ mt: 2 }}>
                Total:{" "}
                {fmt(Math.max(0, sellItem.price * sellQty - sellDiscount))}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSellItem(null)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSell}
            disabled={!sellItem || sellQty < 1}
            sx={{ color: "white" }}
          >
            Complete Sale
          </Button>
        </DialogActions>
      </Dialog>

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
