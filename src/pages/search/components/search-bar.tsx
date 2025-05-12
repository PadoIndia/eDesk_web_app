import type React from "react";

import { useState } from "react";
import Search from "../../../components/ui/search";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center gap-3">
          <Search value={query} onChange={setQuery} />
          <button className="btn btn-primary" type="submit">
            <i className="bi bi-search"></i> Search
          </button>
        </div>
      </form>
    </div>
  );
}
