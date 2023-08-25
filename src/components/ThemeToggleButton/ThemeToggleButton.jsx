import { useTheme } from "../../utils/ThemeProvider";
import { themes } from "../../utils/theme";
import './ThemeToggleButton.css';

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if(theme === themes.light) {
      setTheme(themes.dark);
    } else {
      setTheme(themes.light);
    }
  }
  
  return (
    <button className="theme-toggle-button" onClick={toggleTheme}>
      Toggle theme
    </button>
  );  
}

export default ThemeToggleButton;