import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  PaletteMode,
} from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2196f3", // Blue
    },
    secondary: {
      main: "#f50057", // Pink
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light blue
    },
    secondary: {
      main: "#f48fb1", // Light pink
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  components: {
    MuiAppBar: {
      defaultProps: {
        color: "default",
      },
      styleOverrides: {
        root: {
          backgroundColor: "#1a1a1a",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#272727",
          transition: "transform 0.3s ease-in-out",
          "&:hover": {
            transform: "scale(1.03)",
          },
        },
      },
    },
  },
});

type ThemeContextType = {
  mode: PaletteMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  toggleTheme: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Theme provider component
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeContextProvider: React.FC<ThemeProviderProps> = ({
  children,
}) => {
  // Check localStorage for saved theme preference, default to dark
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as PaletteMode) || "dark";
  });

  // Toggle theme function
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // Get current theme based on mode
  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
