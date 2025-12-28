import { useState } from "react";
import "./button.css";

const ButtonGroup = ({ buttons }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleClick = (i) => {
    setActiveIndex(i);
    console.log(setActiveIndex);
  };

  return (
    <>
      {buttons.map((buttonName, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={index === activeIndex ? "btn-group" : "btn-group"}>
          {buttonName}
        </button>
      ))}
    </>
  );
};

export default ButtonGroup;
