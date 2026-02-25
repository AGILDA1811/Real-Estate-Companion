/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);
const MAX_COMPARE_ITEMS = 3;

function getPropertyId(property) {
  return property?.id || property?._id;
}

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  function addToCompare(property) {
    const id = getPropertyId(property);
    if (!property || !id) {
      return { ok: false, message: "Property is missing required data." };
    }

    const alreadyExists = compareList.some((item) => getPropertyId(item) === id);
    if (alreadyExists) {
      return { ok: true, message: "Property is already selected." };
    }

    if (compareList.length >= MAX_COMPARE_ITEMS) {
      return { ok: false, message: "You can compare up to 3 properties." };
    }

    setCompareList((prev) => [...prev, property]);
    return { ok: true, message: "Added to compare." };
  }

  function removeFromCompare(id) {
    setCompareList((prev) => prev.filter((item) => getPropertyId(item) !== id));
  }

  function clearCompare() {
    setCompareList([]);
  }

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
  };

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }
  return context;
}
