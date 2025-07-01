import React from "react";
import { Colors } from "../utils/constants";
import { getMediaUrl } from "../utils/helper";

interface AvatarProps {
  title: string;
  imageUrl?: string | null;
  size?: number;
  bgColor?: string;
  fontSize?: number;
}

const Avatar: React.FC<AvatarProps> = ({
  title,
  imageUrl,
  size = 40,
  bgColor,
  fontSize,
}) => {
  const initials = title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const finalFontSize = fontSize ?? size * 0.5;

  return imageUrl ? (
    <img
      src={getMediaUrl(imageUrl)}
      alt={title}
      className="rounded-circle"
      style={{
        objectFit: "cover",
      }}
      width={size}
      height={size}
    />
  ) : (
    <div
      className="d-flex me-1 justify-content-center align-items-center rounded-circle fw-bold"
      style={{
        width: size,
        height: size,
        backgroundColor: bgColor || Colors.BGColorList[2],
        fontSize: finalFontSize,
        textTransform: "uppercase",
        color: Colors.text.title,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
