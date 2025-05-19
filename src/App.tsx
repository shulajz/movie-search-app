import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import FavoritesPage from "./pages/FavoritesPage";
import WatchlistPage from "./pages/WatchlistPage";
import { ThemeContextProvider } from "./context/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <Router>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeContextProvider>
  );
};

export default App;
