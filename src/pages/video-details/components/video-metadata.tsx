import { useState } from "react";
import { SingleVideoResponse } from "../../../types/video.types";
import videoService from "../../../services/api-services/video.service";

type Props = {
  vidDetails: SingleVideoResponse;
};

type TagDisplay = {
  id: number;
  name: string;
};

export default function VideoSidebar({ vidDetails }: Props) {
  const [tags, setTags] = useState<TagDisplay[]>(
    vidDetails.ecVideoTags.map((et) => ({
      id: et.tagId,
      name: et.tag.tag,
    }))
  );
  const [tagInput, setTagInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [tagError, setTagError] = useState<string | null>(null);

  const handleAddTag = async () => {
    const trimmedTag = tagInput.trim();
    const trimmedCategory = categoryInput.trim();

    if (!trimmedTag || !trimmedCategory) return;

    const existing = vidDetails.ecVideoTags.find(
      (t) => t.tag.tag.toLowerCase() === trimmedTag.toLowerCase()
    );

    try {
      if (existing) {
        await videoService.addVideoTag(vidDetails.id, existing.tagId);
        setTags((prev) =>
          prev.some((t) => t.id === existing.tagId)
            ? prev
            : [...prev, { id: existing.tagId, name: existing.tag.tag }]
        );
      } else {
        const res = await videoService.addNewVideoTag(vidDetails.id, {
          tag: trimmedTag,
          category: trimmedCategory,
        });

        if (res.status === "success") {
          setTags((prev) => [
            ...prev,
            { id: res.data.tagId, name: trimmedTag },
          ]);
        }
      }

      setTagInput("");
      setCategoryInput("");
    } catch {
      setTagError("Failed to add tag");
    }
  };

  return (
    <div className="card my-1">
      <div className="p-3 metadata-section">
        <h3 className="metadata-label">Tags</h3>

        <div className="d-flex flex-wrap gap-2 mb-2">
          <input
            className="form-control form-control-sm"
            type="text"
            placeholder="Tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            list="existing-tags"
          />
          <input
            className="form-control form-control-sm"
            type="text"
            placeholder="Category"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
          />
          <button className="btn btn-sm btn-primary" onClick={handleAddTag}>
            Add
          </button>
          <datalist id="existing-tags">
            {tags.map((tag) => (
              <option key={tag.id} value={tag.name} />
            ))}
          </datalist>
        </div>

        {tagError ? (
          <p className="text-danger">{tagError}</p>
        ) : (
          <div className="d-flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <span
                  key={tag.id}
                  className="tag bg-primary text-white px-2 py-1 rounded"
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <span className="text-muted">No tags yet</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
