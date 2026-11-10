/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CreationsContext = createContext(null);
const DB_NAME = "mindpace-library";
const STORE_NAME = "creations";

function openLibrary() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error("Local library is unavailable in this browser."));
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function runStore(mode, action) {
  const db = await openLibrary();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const result = action(tx.objectStore(STORE_NAME));
    tx.oncomplete = () => resolve(result?.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

const CreationsProvider = ({ children }) => {
  const [creations, setCreations] = useState([]);
  const [storageWarning, setStorageWarning] = useState("");

  const refresh = useCallback(async () => {
    try {
      const all = await runStore("readonly", (store) => store.getAll());
      setCreations((all || []).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
      setStorageWarning("");
    } catch {
      setStorageWarning("Your browser could not open local storage. New creations will remain available for this session only.");
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addCreation = useCallback(async (creation) => {
    const item = { ...creation, id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString() };
    try {
      await runStore("readwrite", (store) => store.put(item));
      setStorageWarning("");
    } catch {
      setStorageWarning("This creation could not be saved to this browser, but it is still available in the current session.");
    }
    setCreations((items) => [item, ...items.filter((entry) => entry.id !== item.id)]);
    return item;
  }, []);

  const removeCreation = useCallback(async (id) => {
    try { await runStore("readwrite", (store) => store.delete(id)); }
    catch { setStorageWarning("This item could not be removed from browser storage."); }
    setCreations((items) => items.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(() => ({ creations, storageWarning, addCreation, removeCreation, refresh }), [creations, storageWarning, addCreation, removeCreation, refresh]);
  return <CreationsContext.Provider value={value}>{children}</CreationsContext.Provider>;
};

export const useCreations = () => {
  const context = useContext(CreationsContext);
  if (!context) throw new Error("useCreations must be used inside CreationsProvider");
  return context;
};

export default CreationsProvider;

