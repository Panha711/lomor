"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import ImageIcon from "@mui/icons-material/Image";
import {
  CLOTHING_TYPES,
  CLOTHING_SIZES,
  CLOTHING_COLORS,
} from "@/types/clothes";
import type { ClothingFormData } from "@/types/clothes";

interface ClothesFormProps {
  initialData?: ClothingFormData;
  onSubmit: (data: ClothingFormData) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
}

const EMPTY_FORM: ClothingFormData = {
  name: "",
  type: "",
  size: "",
  color: "",
  price: 0,
  price_old: 0,
  quantity: 0,
  image_url: "",
};

export default function ClothesForm({
  initialData,
  onSubmit,
  submitLabel,
  onCancel,
}: ClothesFormProps) {
  const [form, setForm] = useState<ClothingFormData>(initialData ?? EMPTY_FORM);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pasteError, setPasteError] = useState("");

  function update(field: keyof ClothingFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Name is required.");
    if (!form.type) return setError("Type is required.");
    if (!form.size) return setError("Size is required.");
    if (!form.color) return setError("Color is required.");
    if (form.price < 0) return setError("Price must be 0 or more.");
    if ((form.price_old ?? 0) < 0) return setError("Price old must be 0 or more.");
    if (form.quantity < 0) return setError("Quantity must be 0 or more.");

    setSaving(true);
    try {
      await onSubmit({ ...form, image_url: form.image_url || null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasteImage() {
    setPasteError("");
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith("image/")) {
            const blob = await item.getType(type);
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            update("image_url", dataUrl);
            return;
          }
        }
      }
      setPasteError(
        "No image found in clipboard. Copy an image first (e.g. from Telegram).",
      );
    } catch (err) {
      if (err instanceof Error && err.name === "NotAllowedError") {
        setPasteError("Paste denied. Allow clipboard access when prompted.");
      } else {
        setPasteError("Could not read clipboard. Copy an image and try again.");
      }
    }
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2.5}>
          {/* Name */}
          <Grid size={12}>
            <TextField
              label="Name"
              fullWidth
              placeholder="e.g. Classic Oxford Shirt"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </Grid>

          {/* Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.type}
                label="Type"
                onChange={(e) => update("type", e.target.value)}
              >
                {CLOTHING_TYPES.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Size */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={form.size}
                label="Size"
                onChange={(e) => update("size", e.target.value)}
              >
                {CLOTHING_SIZES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Color */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Color</InputLabel>
              <Select
                value={form.color}
                label="Color"
                onChange={(e) => update("color", e.target.value)}
              >
                {CLOTHING_COLORS.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Price old */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Price old ($)"
              type="number"
              fullWidth
              placeholder="Optional"
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              value={form.price_old != null && form.price_old > 0 ? form.price_old : ""}
              onChange={(e) =>
                update("price_old", parseFloat(e.target.value) || 0)
              }
            />
          </Grid>

          {/* Price */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Price ($)"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              value={form.price || ""}
              onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
            />
          </Grid>

          {/* Quantity */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              slotProps={{ htmlInput: { min: 0, step: 1 } }}
              value={form.quantity || ""}
              onChange={(e) =>
                update("quantity", parseInt(e.target.value, 10) || 0)
              }
            />
          </Grid>

          {/* Image URL */}
          <Grid size={12}>
            <TextField
              label="Image URL (optional)"
              type="text"
              fullWidth
              placeholder="Paste URL or use “Paste image” after copying from Telegram"
              value={
                typeof form.image_url === "string" &&
                form.image_url.startsWith("data:")
                  ? "[Image from clipboard]"
                  : (form.image_url ?? "")
              }
              onChange={(e) => update("image_url", e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        startIcon={<ImageIcon />}
                        onClick={handlePasteImage}
                        sx={{ flexShrink: 0 }}
                      >
                        Paste image
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {pasteError && (
              <Alert severity="info" sx={{ mt: 1 }}>
                {pasteError}
              </Alert>
            )}
            {typeof form.image_url === "string" &&
              form.image_url.startsWith("data:") && (
                <Box
                  sx={{
                    mt: 1,
                    borderRadius: 1,
                    overflow: "hidden",
                    maxWidth: 120,
                    maxHeight: 120,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    component="img"
                    src={form.image_url}
                    alt="Pasted"
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Box>
              )}
          </Grid>

          {/* Actions */}
          <Grid size={12}>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mt: 1,
                justifyContent: "flex-end",
              }}
            >
              {onCancel && (
                <Button variant="outlined" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" variant="contained" disabled={saving}>
                {saving ? "Saving..." : submitLabel}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
