"use client";

import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { getClothes } from "@/lib/clothes-api";
import { createSale } from "@/lib/sales-api";
import Receipt from "@/components/Receipt";
import type { ClothingItem } from "@/types/clothes";
import type { Sale } from "@/types/sale";

const COLOR_HEX: Record<string, string> = {
  Black: "#1a1a1a",
  White: "#e0e0e0",
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
  Cream: "#f5f0e1",
  Maroon: "#800000",
  Teal: "#14b8a6",
  Multicolor: "#888",
  Other: "#aaa",
};

const fmtMoney = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(v);

export default function SellPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [sellItem, setSellItem] = useState<ClothingItem | null>(null);
  const [sellQty, setSellQty] = useState(1);
  const [sellDiscount, setSellDiscount] = useState(0);
  const [receiptSale, setReceiptSale] = useState<Sale | null>(null);
  const [detailItem, setDetailItem] = useState<ClothingItem | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const inStockItems = useMemo(
    () => items.filter((i) => i.quantity > 0),
    [items],
  );

  const paginatedItems = useMemo(() => {
    const start = page * rowsPerPage;
    return inStockItems.slice(start, start + rowsPerPage);
  }, [inStockItems, page, rowsPerPage]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getClothes().then(setItems);
  }, []);

  useEffect(() => {
    if (inStockItems.length > 0 && page * rowsPerPage >= inStockItems.length) {
      setPage(Math.max(0, Math.ceil(inStockItems.length / rowsPerPage) - 1));
    }
  }, [inStockItems.length, page, rowsPerPage]);

  async function handleSell() {
    if (!sellItem || sellQty < 1 || sellQty > sellItem.quantity) return;
    const discount = Math.min(sellDiscount, sellItem.price * sellQty);
    const sale = await createSale(
      [{ itemId: sellItem.id, quantity: sellQty }],
      { discount },
    );
    setSellItem(null);
    setSellQty(1);
    setSellDiscount(0);
    getClothes().then(setItems);
    if (sale) {
      setReceiptSale(sale);
    }
  }

  return (
    <>
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
                          (e.target as HTMLImageElement).style.display = "none";
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
                          {fmtMoney(detailItem.price)}
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
