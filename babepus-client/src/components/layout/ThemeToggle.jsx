import Button from "../ui/Button";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="secondary" size="sm" onClick={toggleTheme}>
      {theme === "dark" ? "Light" : "Dark"}
    </Button>
  );
};

export default ThemeToggle;
