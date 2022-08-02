import { SettingsContext } from "contexts/SettingsContext";
import { useContext } from "react";

const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context)
    throw new Error("useSettings must be used inside a SettingsProvider");

  return context;
};

export default useSettings;
