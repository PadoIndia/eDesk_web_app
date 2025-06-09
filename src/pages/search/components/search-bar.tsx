import type React from "react";
import { useState } from "react";
import Search from "../../../components/ui/search";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <div className="d-flex justify-content-center gap-3">
        <Search value={query} onChange={setQuery} onKeyDown={handleKeyDown} />
        <button className="btn btn-primary" onClick={() => onSearch(query)}>
          <i className="bi bi-search"></i> Search
        </button>
      </div>
    </div>
  );
}
