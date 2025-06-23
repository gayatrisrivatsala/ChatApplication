import { ColorModeScript } from "@chakra-ui/react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import {ChatProvider} from "./ChatProvider";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <ChatProvider>
          <Providers>{children}</Providers>
        </ChatProvider>
      </body>
    </html>
  );
}
