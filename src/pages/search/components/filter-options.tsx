import type React from "react";

import { useState, useEffect } from "react";
import { TagResponse } from "../../../types/tag.types";
import tagService from "../../../services/api-services/tag.service";

export type Filters = {
  uploadDate: string;
  platform: string;
  tagId: number | null;
};

interface FilterOptionsProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  uploaders: string[];
}

export default function FilterOptions({
  filters,
  onFilterChange,
  uploaders,
}: FilterOptionsProps) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(
    filters.tagId
  );
  const [allTags, setAllTags] = useState<TagResponse[]>([]);

  useEffect(() => {
    tagService.getAllTags().then((res) => {
      if (res.status === "success") setAllTags(res.data);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagClick = (tag: number) => {
    setSelectedTagId(tag);
  };

  const handleReset = () => {
    setLocalFilters({
      uploadDate: "",
      platform: "",
      tagId: 0,
    });
    setSelectedTagId(null);
  };

  const handleApply = () => {
    onFilterChange({
      ...localFilters,
      tagId: selectedTagId,
    });
  };

  useEffect(() => {
    setLocalFilters(filters);
    setSelectedTagId(filters.tagId);
  }, [filters]);

  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      tags: selectedTagId,
    }));
  }, [selectedTagId]);

  return (
    <div className="filter-options card">
      <div className="card-header">
        <h5 className="mb-0">Filter Results</h5>
      </div>
      <div className="card-body">
        {/* <div className="mb-3">
          <label htmlFor="uploadDate" className="form-label">
            Upload Date
          </label>
          <select
            id="uploadDate"
            name="uploadDate"
            className="form-select"
            value={localFilters.uploadDate}
            onChange={handleChange}
          >
            <option value="">Any time</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div> */}

        <div className="mb-3">
          <label htmlFor="uploader" className="form-label">
            Source
          </label>
          <select
            id="uploader"
            name="uploader"
            className="form-select"
            value={localFilters.platform}
            onChange={handleChange}
          >
            <option value="">-- All --</option>
            {uploaders.map((uploader) => (
              <option key={uploader} value={uploader}>
                {uploader}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <div className="tags-container">
            {allTags.map((tag) => (
              <span
                key={tag.id}
                className={`badge ${
                  selectedTagId === tag.id ? "bg-primary" : "bg-secondary"
                } me-1 mb-1 tag-badge`}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.tag}
              </span>
            ))}
          </div>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-primary" onClick={handleApply}>
            Apply Filters
          </button>
          <button className="btn btn-outline-secondary" onClick={handleReset}>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
