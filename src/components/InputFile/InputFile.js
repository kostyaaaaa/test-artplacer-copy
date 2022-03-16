import React, { Fragment } from "react";
import "./InputFile.css";

const InputFile = ({ onSubmitFile, title }) => {
  const handleFile = (event) => {
    if (event.target.files[0]) {
      onSubmitFile(event.target.files[0]);
    }
  };

  return (
    <Fragment>
      <input
        id={`file-input ${title}`}
        className="file-input"
        type="file"
        accept=".png, .jpeg, .bmp, .tiff"
        onChange={handleFile}
      />
      <label htmlFor={`file-input ${title}`} className="file-input-label">
        {title}
      </label>
    </Fragment>
  );
};

export default InputFile;
