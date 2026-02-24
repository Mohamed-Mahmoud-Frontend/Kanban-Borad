"use client";

import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontSize: "0.875rem",
          borderRadius: "0.5rem",
          padding: "0.5rem 0.75rem",
          border: "1px solid #e7e5e4",
        },
        success: {
          iconTheme: {
            primary: "#22C55E",
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "white",
          },
        },
      }}
    />
  );
}

