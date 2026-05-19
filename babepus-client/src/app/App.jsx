import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { AuthProvider } from "../context/AuthContext";
import { ToastProvider } from "../context/ToastContext";
import { ThemeProvider } from "../context/ThemeContext";
import ToastViewport from "../components/ui/ToastViewport";

const App = () => (
  <ToastProvider>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
          <ToastViewport />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </ToastProvider>
);

export default App;
