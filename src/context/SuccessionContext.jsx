import { createContext, useContext, useState } from "react";

const SuccessionContext = createContext();

export const SuccessionProvider = ({ children }) => {
  const [successionData, setSuccessionDataState] = useState(() => {
    // Check if this is a new tab (no localStorage data)
    const hasLocalStorageData = localStorage.getItem("successionData");
    const hasSessionStorageData = sessionStorage.getItem("successionData");
    
    if (!hasLocalStorageData && hasSessionStorageData) {
      // New tab but has session data - use it
      return JSON.parse(hasSessionStorageData);
    } else if (hasLocalStorageData) {
      // Existing tab or refresh - use localStorage data
      return JSON.parse(hasLocalStorageData);
    }
    return null;
  });

  const setSuccessionData = (data) => {
    setSuccessionDataState(data);
    // Store in both storages for different scenarios
    localStorage.setItem("successionData", JSON.stringify(data));
    sessionStorage.setItem("successionData", JSON.stringify(data));
  };

  const clearSuccessionData = () => {
    setSuccessionDataState(null);
    localStorage.removeItem("successionData");
    sessionStorage.removeItem("successionData");
  };

  return (
    <SuccessionContext.Provider
      value={{ successionData, setSuccessionData, clearSuccessionData }}
    >
      {children}
    </SuccessionContext.Provider>
  );
};

export const useSuccession = () => useContext(SuccessionContext);
