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
import ClothesForm from "@/components/ClothesForm";
import {
  getClothes,
  deleteClothing,
  createClothing,
  updateClothing,
} from "@/lib/clothes-api";
import { CLOTHING_TYPES, CLOTHING_COLORS } from "@/types/clothes";
import type { ClothingItem, ClothingFormData } from "@/types/clothes";

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
          size="small"
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
        <Grid container spacing={1}>
          {filtered.map((item) => (
            <Grid key={item.id} size={12}>
              <Card variant="outlined">
                <CardContent sx={{ pb: 0.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle2">{item.name}</Typography>
                    <StatusChip qty={item.quantity} />
                  </Box>
                  <Stack
                    direction="row"
                    spacing={0.5}
                    flexWrap="wrap"
                    useFlexGap
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
                    {fmt(item.price)} · Qty {item.quantity}
                  </Typography>
                </CardContent>
                <CardActions sx={{ pt: 0, px: 1.5, pb: 1 }}>
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
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Color</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.size}</TableCell>
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
                  <TableCell>{fmt(item.price)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <StatusChip qty={item.quantity} />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
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
      )}

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
    </>
  );
}

function StatusChip({ qty }: { qty: number }) {
  if (qty === 0)
    return (
      <Chip
        label="Out"
        size="small"
        color="error"
        variant="filled"
        sx={{ fontWeight: 600, fontSize: 11, height: 22 }}
      />
    );
  if (qty <= 5)
    return (
      <Chip
        label="Low"
        size="small"
        color="warning"
        variant="filled"
        sx={{ fontWeight: 600, fontSize: 11, height: 22 }}
      />
    );
  return (
    <Chip
      label="OK"
      size="small"
      color="success"
      variant="filled"
      sx={{ fontWeight: 600, fontSize: 11, height: 22 }}
    />
  );
}
