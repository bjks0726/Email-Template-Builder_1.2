import React, { useState, useEffect } from "react";
import Builder from "./pages/Builder.jsx";
import SnippetStudio from "./pages/SnippetStudio.jsx";
import { persist } from "./lib/storage.jsx";

// Simple hash-based routing: #builder (default) or #studio
function readHashRoute() {
  const h = window.location.hash.replace(/^#/, "");
  return h === "studio" ? "studio" : "builder";
}

export default function App() {
  const [route, setRoute] = useState(readHashRoute);
  const [customSnippets, setCustomSnippets] = useState(() => persist.loadCustomSnippets());

  // Keep URL hash in sync
  useEffect(() => {
    window.location.hash = route === "studio" ? "#studio" : "#builder";
  }, [route]);

  // Listen for back/forward nav
  useEffect(() => {
    const onHashChange = () => setRoute(readHashRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (route === "studio") {
    return (
      <SnippetStudio
        customSnippets={customSnippets}
        setCustomSnippets={setCustomSnippets}
        onNavigateBack={() => setRoute("builder")}
      />
    );
  }

  return (
    <Builder
      customSnippets={customSnippets}
      onNavigateToStudio={() => setRoute("studio")}
    />
  );
}
