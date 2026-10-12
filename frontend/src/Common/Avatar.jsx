import React, { useState } from "react";

const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const DEFAULT_AVATAR = `${IMAGE_BASE_URL}/avatar/default-avatar.png`;

const Avatar = ({ src, alt = "Avatar", className = "" }) => {
  const [imgSrc, setImageSrc] = useState(
    src ? `${IMAGE_BASE_URL}/avatar/${src}` : DEFAULT_AVATAR,
  );
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imgSrc !== DEFAULT_AVATAR) {
          setImageSrc(DEFAULT_AVATAR);
        }
      }}
    />
  );
};

export default Avatar;
