import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LoadingProvider from "./loadingProvider";
import { TreeProvider } from "@/context/TreeContext";
import { Toaster } from "sonner";



export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className="font-sans">
      <body
      >
        <TreeProvider>
          <LoadingProvider>
            {children}
            <Toaster richColors position="top-center" />

          </LoadingProvider>
        </TreeProvider>
      </body>
    </html>
  );
}
