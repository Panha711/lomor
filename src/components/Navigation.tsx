"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import AssessmentIcon from "@mui/icons-material/Assessment";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { href: "/clothes", label: "Clothes List", icon: <CheckroomIcon /> },
  { href: "/reports", label: "Reports", icon: <AssessmentIcon /> },
];

interface NavigationProps {
  drawerWidth: number;
}

export default function Navigation({ drawerWidth }: NavigationProps) {
  const pathname = usePathname() ?? "/";
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      {/* Brand */}
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            bgcolor: "primary.main",
            color: "#fff",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          L
        </Box>
        <Typography variant="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
          Lomor
        </Typography>
      </Box>

      <Divider />

      {/* Nav Links */}
      <List sx={{ flex: 1, px: 1.5, py: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                onClick={() => {
                  if (!isDesktop) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 1.5,
                  "&.Mui-selected": {
                    bgcolor: "rgba(168, 92, 50, 0.08)",
                    color: "primary.main",
                    "& .MuiListItemIcon-root": {
                      color: "primary.main",
                    },
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "rgba(168, 92, 50, 0.12)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Clothing Inventory
        </Typography>
      </Box>
    </>
  );

  return (
    <>
      {/* Mobile AppBar */}
      {!isDesktop && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                width: 30,
                height: 30,
                bgcolor: "primary.main",
                color: "#fff",
                borderRadius: 0.75,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15,
                mr: 1,
              }}
            >
              L
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
              Lomor
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer (temporary) */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop Drawer (permanent) */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}
