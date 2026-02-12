"use client";

import { useEffect, useState } from "react";
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
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import { getClothes, computeStats } from "@/lib/clothes-api";
import type { ClothingItem } from "@/types/clothes";
import type { DashboardStats } from "@/lib/clothes-api";

const COLOR_HEX: Record<string, string> = {
    Black: "#000", White: "#fff", Red: "#ef4444", Blue: "#3b82f6",
    Navy: "#1e3a5f", Green: "#22c55e", Yellow: "#eab308", Orange: "#f97316",
    Purple: "#a855f7", Pink: "#ec4899", Brown: "#92400e", Grey: "#6b7280",
    Beige: "#d2b48c", Cream: "#fffdd0", Maroon: "#800000", Teal: "#14b8a6",
};

const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

export default function ReportsPage() {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        getClothes().then((d) => { setItems(d); setStats(computeStats(d)); });
    }, []);

    function exportCSV() {
        if (!items.length) return;
        const rows = [["Name", "Type", "Size", "Color", "Price", "Quantity", "Status"]];
        items.forEach((i) => rows.push([i.name, i.type, i.size, i.color, String(i.price), String(i.quantity), i.quantity === 0 ? "Out" : i.quantity <= 5 ? "Low" : "OK"]));
        const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = `inventory-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
    }

    const low = items.filter((i) => i.quantity > 0 && i.quantity <= 5);
    const out = items.filter((i) => i.quantity === 0);

    const cards = [
        { label: "Total Items", value: stats?.totalItems ?? 0, icon: <LocalOfferIcon fontSize="small" />, bg: "#a85c32", fg: "#fff" },
        { label: "Inventory Value", value: fmt(stats?.totalValue ?? 0), icon: <AttachMoneyIcon fontSize="small" />, bg: "#dbeafe", fg: "#2563eb" },
        { label: "Low Stock", value: low.length, icon: <WarningAmberIcon fontSize="small" />, bg: "#fef3c7", fg: "#d97706" },
        { label: "Out of Stock", value: out.length, icon: <CancelIcon fontSize="small" />, bg: "#fee2e2", fg: "#dc2626" },
    ];

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
                <Box>
                    <Typography variant="h1" sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, mb: 0.25 }}>Reports</Typography>
                    <Typography variant="body2">Inventory insights</Typography>
                </Box>
                <Button variant="outlined" size="small" startIcon={<DownloadIcon fontSize="small" />} onClick={exportCSV}>
                    Export CSV
                </Button>
            </Box>

            {/* Summary */}
            <Grid container spacing={1.5} sx={{ mb: 4 }}>
                {cards.map((c) => (
                    <Grid key={c.label} size={{ xs: 6, md: 3 }}>
                        <Card variant="outlined">
                            <CardContent sx={{ p: { xs: 1.5, md: 2.5 }, "&:last-child": { pb: { xs: 1.5, md: 2.5 } } }}>
                                <Box sx={{ width: 34, height: 34, borderRadius: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: c.bg, color: c.fg, mb: 1.5 }}>
                                    {c.icon}
                                </Box>
                                <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.5rem" }, fontWeight: 700 }}>{c.value}</Typography>
                                <Typography variant="body2" sx={{ fontSize: 12 }}>{c.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Low Stock */}
            <Section title={`Low Stock (${low.length})`}>
                {low.length === 0 ? (
                    <Empty text="No low-stock items." />
                ) : (
                    <SimpleTable
                        heads={["Name", "Type", "Color", "Size", "Left"]}
                        rows={low.map((i) => [i.name, i.type, <ColorCell key="c" color={i.color} />, i.size, <Chip key="q" label={i.quantity} size="small" color="warning" variant="filled" sx={{ fontWeight: 600, fontSize: 11, height: 22 }} />])}
                    />
                )}
            </Section>

            {/* Out of Stock */}
            <Section title={`Out of Stock (${out.length})`}>
                {out.length === 0 ? (
                    <Empty text="All items in stock!" />
                ) : (
                    <SimpleTable
                        heads={["Name", "Type", "Color", "Size", "Price"]}
                        rows={out.map((i) => [i.name, i.type, <ColorCell key="c" color={i.color} />, i.size, fmt(i.price)])}
                    />
                )}
            </Section>

            {/* By Type */}
            <Section title="Stock by Type">
                {Object.keys(stats?.typeBreakdown ?? {}).length === 0 ? <Empty /> : (
                    <Grid container spacing={1}>
                        {Object.entries(stats!.typeBreakdown).sort((a, b) => b[1] - a[1]).map(([t, q]) => (
                            <Grid key={t} size={{ xs: 4, sm: 3, md: 2 }}>
                                <Paper variant="outlined" sx={{ p: 1.5 }}>
                                    <Typography variant="body2" sx={{ fontSize: 12 }}>{t}</Typography>
                                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>{q}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Section>

            {/* By Color */}
            <Section title="Stock by Color">
                {Object.keys(stats?.colorBreakdown ?? {}).length === 0 ? <Empty /> : (
                    <Grid container spacing={1}>
                        {Object.entries(stats!.colorBreakdown).sort((a, b) => b[1] - a[1]).map(([c, q]) => (
                            <Grid key={c} size={{ xs: 4, sm: 3, md: 2 }}>
                                <Paper variant="outlined" sx={{ p: 1.5 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.25 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: COLOR_HEX[c] ?? "#ccc", border: "1px solid #ddd" }} />
                                        <Typography variant="body2" sx={{ fontSize: 12 }}>{c}</Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 700 }}>{q}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Section>
        </>
    );
}

/* ---- Helpers ---- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Box sx={{ mb: 3.5 }}>
            <Typography variant="h3" sx={{ fontSize: 15, mb: 1.5 }}>{title}</Typography>
            {children}
        </Box>
    );
}

function Empty({ text = "No data." }: { text?: string }) {
    return (
        <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>{text}</Typography>
        </Paper>
    );
}

function ColorCell({ color }: { color: string }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLOR_HEX[color] ?? "#ccc", border: "1px solid #ddd" }} />
            {color}
        </Box>
    );
}

function SimpleTable({ heads, rows }: { heads: string[]; rows: React.ReactNode[][] }) {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size="small">
                <TableHead>
                    <TableRow>{heads.map((h) => <TableCell key={h}>{h}</TableCell>)}</TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, i) => (
                        <TableRow key={i} hover>
                            {row.map((cell, j) => (
                                <TableCell key={j} sx={j === 0 ? { fontWeight: 500 } : undefined}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
