import type { Metadata } from "next";
import ThemeRegistry from "@/theme/ThemeRegistry";
import Navigation from "@/components/Navigation";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export const metadata: Metadata = {
  title: "Lomor Admin",
  description: "Lomor Clothing Inventory Management",
};

const DRAWER_WIDTH = 260;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>
          <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <Navigation drawerWidth={DRAWER_WIDTH} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                minWidth: 0,
                p: { xs: 2, sm: 3, md: 4 },
              }}
            >
              {/* Spacer for mobile AppBar */}
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Toolbar />
              </Box>
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
