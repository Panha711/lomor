"use client";

import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Stack from "@mui/material/Stack";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getClothes, computeStats } from "@/lib/clothes-api";
import { getSales } from "@/lib/sales-api";
import type { ClothingItem } from "@/types/clothes";
import type { DashboardStats } from "@/lib/clothes-api";

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

const CHART_COLORS = [
  "#4caf50",
  "#2196f3",
  "#ff9800",
  "#e91e63",
  "#9c27b0",
  "#00bcd4",
  "#ff5722",
  "#607d8b",
  "#795548",
  "#8bc34a",
  "#3f51b5",
  "#ffc107",
  "#009688",
];

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

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

const fmtK = (v: number) => {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`;
  return `$${v}`;
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [totalSalesRevenue, setTotalSalesRevenue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    getClothes().then((d) => {
      setItems(d);
      setStats(computeStats(d));
    });
    setTotalSalesRevenue(getSales().reduce((sum, s) => sum + s.total, 0));
  }, []);

  /* ---- derived data for charts ---- */

  const barData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.typeBreakdown)
      .map(([type, qty]) => {
        const value = items
          .filter((i) => i.type === type)
          .reduce((s, i) => s + i.price * i.quantity, 0);
        return { type, quantity: qty, value: Math.round(value) };
      })
      .sort((a, b) => b.quantity - a.quantity);
  }, [stats, items]);

  const pieData = useMemo(() => {
    if (!stats) return [];
    const total = Object.values(stats.typeBreakdown).reduce((a, b) => a + b, 0);
    return Object.entries(stats.typeBreakdown)
      .map(([name, value]) => ({
        name,
        value,
        pct: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  const colorData = useMemo(() => {
    if (!stats) return [];
    const total = Object.values(stats.colorBreakdown).reduce(
      (a, b) => a + b,
      0,
    );
    return Object.entries(stats.colorBreakdown)
      .map(([name, value]) => ({
        name,
        value,
        pct: total > 0 ? Math.round((value / total) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  /* ---- stat cards ---- */

  const cards = [
    {
      label: "Total Items",
      value: stats?.totalItems ?? 0,
      icon: <LocalOfferIcon sx={{ fontSize: 18 }} />,
      iconBg: "#e8f5e9",
      iconColor: "#43a047",
    },
    {
      label: "Total Value",
      value: fmt(stats?.totalValue ?? 0),
      icon: <AttachMoneyIcon sx={{ fontSize: 18 }} />,
      iconBg: "#e3f2fd",
      iconColor: "#1e88e5",
    },
    {
      label: "Total Sales",
      value: fmt(totalSalesRevenue),
      icon: <TrendingUpIcon sx={{ fontSize: 18 }} />,
      iconBg: "#e8f5e9",
      iconColor: "#2e7d32",
    },
    {
      label: "In Stock",
      value: stats?.inStock ?? 0,
      icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
      iconBg: "#e8f5e9",
      iconColor: "#43a047",
    },
    {
      label: "Out of Stock",
      value: stats?.outOfStock ?? 0,
      icon: <CancelIcon sx={{ fontSize: 18 }} />,
      iconBg: "#fce4ec",
      iconColor: "#e53935",
    },
  ];

  return (
    <>
      {/* Title */}
      <Typography
        sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, mb: 2.5 }}
      >
        Dashboard
      </Typography>

      {/* ─── Stat Cards Row ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {cards.map((c) => (
          <Grid key={c.label} size={{ xs: 6, sm: 4, lg: 2.4 }}>
            <Card
              variant="outlined"
              sx={{
                height: "100%",
                transition: "box-shadow .2s",
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: c.iconBg,
                      color: c.iconColor,
                    }}
                  >
                    {c.icon}
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    {c.label}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: 20, md: 26 },
                    fontWeight: 700,
                    lineHeight: 1.1,
                  }}
                >
                  {c.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ─── Bar Chart: Inventory by Type ─── */}
      <Card variant="outlined" sx={{ mb: 3, p: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            Inventory by Type
          </Typography>
          <Stack direction="row" spacing={2}>
            <LegendDot color="#4caf50" label="Quantity" />
            <LegendDot color="#2196f3" label="Value ($)" />
          </Stack>
        </Box>
        {barData.length === 0 ? (
          <EmptyState text="Add items to see the chart" />
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
            <BarChart data={barData} barGap={2} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="type"
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="qty"
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <YAxis
                yAxisId="val"
                orientation="right"
                tickFormatter={(v: number) => fmtK(v)}
                tick={{ fontSize: 12, fill: "#888" }}
                axisLine={false}
                tickLine={false}
                width={50}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #eee",
                  fontSize: 13,
                }}
                formatter={(value: unknown, name?: string) => {
                  const v = Number(value);
                  return name === "value" ? [fmt(v), "Value"] : [v, "Quantity"];
                }}
              />
              <Bar
                yAxisId="qty"
                dataKey="quantity"
                fill="#4caf50"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                yAxisId="val"
                dataKey="value"
                fill="#2196f3"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* ─── Bottom Row: Donut + Color Breakdown ─── */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Donut: Stock by Category */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%", p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
              Stock by Category
            </Typography>
            {pieData.length === 0 ? (
              <EmptyState text="No data yet" />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: isMobile ? 180 : 220,
                    height: isMobile ? 180 : 220,
                    flexShrink: 0,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="55%"
                        outerRadius="85%"
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{
                          borderRadius: 8,
                          border: "1px solid #eee",
                          fontSize: 13,
                        }}
                        formatter={(value: unknown, name: unknown) => [
                          Number(value),
                          String(name),
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Grid container spacing={0.5}>
                    {pieData.map((d, i) => (
                      <Grid key={d.name} size={{ xs: 6 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                            py: 0.4,
                          }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: CHART_COLORS[i % CHART_COLORS.length],
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontSize: 12,
                              color: "text.secondary",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {d.name} &ndash; {d.pct}%
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}
          </Card>
        </Grid>

        {/* Color Breakdown */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: "100%", p: { xs: 2, md: 3 } }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
              Stock by Color
            </Typography>
            {colorData.length === 0 ? (
              <EmptyState text="No data yet" />
            ) : (
              <Stack spacing={1.25}>
                {colorData.slice(0, 8).map((d) => (
                  <Box
                    key={d.name}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        bgcolor: COLOR_HEX[d.name] ?? "#ccc",
                        border: "1px solid #e0e0e0",
                        flexShrink: 0,
                      }}
                    />
                    <Typography sx={{ fontSize: 13, minWidth: 70 }}>
                      {d.name}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        height: 8,
                        bgcolor: "#f0f0f0",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${d.pct}%`,
                          height: "100%",
                          bgcolor: COLOR_HEX[d.name] ?? "#888",
                          borderRadius: 4,
                          transition: "width .3s",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        minWidth: 36,
                        textAlign: "right",
                      }}
                    >
                      {d.pct}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* ─── Recent Items Table ─── */}
      {items.length > 0 && (
        <Card variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2 }}>
            Recently Added
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  {!isMobile && <TableCell>Size</TableCell>}
                  {!isMobile && <TableCell>Color</TableCell>}
                  <TableCell>Price</TableCell>
                  <TableCell>Qty</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.slice(0, 5).map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    {!isMobile && <TableCell>{item.size}</TableCell>}
                    {!isMobile && (
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.75,
                          }}
                        >
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              bgcolor: COLOR_HEX[item.color] ?? "#ccc",
                              border: "1px solid #e0e0e0",
                            }}
                          />
                          {item.color}
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>{fmt(item.price)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Box
        sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }}
      />
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 140,
        color: "text.secondary",
      }}
    >
      <Typography sx={{ fontSize: 14 }}>{text}</Typography>
    </Box>
  );
}
