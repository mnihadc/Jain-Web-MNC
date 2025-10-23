// src/providers/ThemeProvider.tsx
import React from "react";
import { ThemeProvider } from "styled-components";
import { eduProTheme } from "../styles/theme";
import { GlobalStyles } from "../styles/GlobalStyles";

const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={eduProTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
