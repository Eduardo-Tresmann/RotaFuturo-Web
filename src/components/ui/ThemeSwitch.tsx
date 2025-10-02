import React from "react";
import { useTheme } from "../context/ThemeContext";
import styles from "./ThemeSwitch.module.css";
export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        aria-label="Alternar tema"
      />
      <span className={styles.slider + " " + styles.round}>
        <div className={styles.background}></div>
        <div className={styles.star}></div>
        <div className={styles.star}></div>
      </span>
    </label>
  );
}
