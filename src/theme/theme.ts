"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#a85c32",
            dark: "#8f4a24",
            light: "#c48b6a",
            contrastText: "#fff",
        },
        secondary: {
            main: "#6b6560",
            light: "#8a857f",
            dark: "#4a4643",
        },
        error: {
            main: "#ef4444",
        },
        warning: {
            main: "#f59e0b",
        },
        success: {
            main: "#22c55e",
        },
        info: {
            main: "#3b82f6",
        },
        background: {
            default: "#f8f7f6",
            paper: "#ffffff",
        },
        text: {
            primary: "#1c1b19",
            secondary: "#6b6560",
        },
        divider: "#e8e6e3",
    },
    typography: {
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        h1: { fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" },
        h2: { fontSize: "1.25rem", fontWeight: 600 },
        h3: { fontSize: "1.125rem", fontWeight: 600 },
        body2: { color: "#6b6560" },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    border: "1px solid #e8e6e3",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    "& .MuiTableCell-head": {
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#6b6560",
                        backgroundColor: "#fafaf9",
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:last-child td": { borderBottom: 0 },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#a85c32",
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: "0.75rem",
                },
            },
        },
    },
});

export default theme;
