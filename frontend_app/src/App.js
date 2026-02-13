import React, { useEffect, useMemo, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { stripCmPrefix } from "./utils/testCaseTitle";

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState("light");

  // Demo input to show the rule in action.
  // In the real app, apply stripCmPrefix(testCaseTitle) right before rendering/exporting.
  const [demoTitle, setDemoTitle] = useState(
    "[CM]-49429:16. #61741: Add Thermal Throttling Support"
  );

  const cleanedDemoTitle = useMemo(() => stripCmPrefix(demoTitle), [demoTitle]);

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>

        <img src={logo} className="App-logo" alt="logo" />

        <p>
          <strong>Test Case title cleanup rule:</strong> remove prefix starting
          with <code>[CM]</code> and ending at first <code>:</code> (inclusive).
        </p>

        <div style={{ width: "min(900px, 92vw)", textAlign: "left" }}>
          <label htmlFor="demoTitle" style={{ display: "block", fontWeight: 600 }}>
            Demo input (represents parsed Test Case title)
          </label>
          <input
            id="demoTitle"
            value={demoTitle}
            onChange={(e) => setDemoTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--border-color)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              marginTop: 8,
            }}
          />

          <div style={{ marginTop: 14 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              Output shown in UI / export:
            </div>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
                wordBreak: "break-word",
              }}
              aria-label="Cleaned test case title preview"
            >
              {cleanedDemoTitle}
            </div>
          </div>
        </div>

        <p style={{ marginTop: 20 }}>
          Current theme: <strong>{theme}</strong>
        </p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
