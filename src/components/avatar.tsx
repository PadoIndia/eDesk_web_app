import React from "react";
import { Colors } from "../utils/constants";

interface AvatarProps {
  title: string;
  imageUrl?: string | null;
  size?: number;
  bgColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  title,
  imageUrl,
  size = 40,
  bgColor,
}) => {
  const initials = title.charAt(0).toUpperCase();

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={title}
      className="rounded-circle"
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
        fontSize: size * 0.5,
        textTransform: "uppercase",
        color: Colors.text.title,
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
