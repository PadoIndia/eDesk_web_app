import { useState, useEffect } from "react";
import SearchBar from "./components/search-bar";
import FilterOptions from "./components/filter-options";
import VideoList from "./components/video-list";
import Pagination from "./components/pagination";
import "./styles.scss";
import Layout from "../../components/layout";
import { VideoResponse } from "../../types/video.types";
import videoService from "../../services/api-services/video.service";

export default function SearchPage() {
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{
    uploadDate: string;
    platform: string;
    tagId: number | null;
  }>({
    uploadDate: "",
    platform: "",
    tagId: null,
  });

  const uploaders = [...new Set(videos.map((video) => video.source))];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!searchQuery && Object.values(filters).filter(Boolean).length == 0)
      return;
    const { tagId, platform } = filters;
    videoService
      .getAllVideos({
        params: {
          name: searchQuery,
          page: currentPage,
          limit: 100,
          ...(platform && { platform }),
          ...(tagId && { tagId }),
        },
      })
      .then((res) => {
        if (res.status === "success") {
          setVideos(res.data);
        }
        setTotalPages(Math.floor(res.meta.total / res.meta.limit!));
      });
  }, [searchQuery, filters]);

  return (
    <Layout showSideBar={false}>
      <div className="container search-page my-4">
        <SearchBar onSearch={handleSearch} />

        <div className="row mt-4">
          <div className="col-md-3">
            <FilterOptions
              filters={filters}
              onFilterChange={handleFilterChange}
              uploaders={uploaders}
            />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          <div className="col-md-9">
            <div className="results-info mb-3">
              <p className="text-muted">
                Showing {videos.length + " "}
                results
              </p>
            </div>

            <VideoList videos={videos} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
