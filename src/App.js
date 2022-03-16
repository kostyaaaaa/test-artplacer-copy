import React, { useState, useRef } from "react";
import InputFile from "./components/InputFile";
import Shine from "./assets/shine-light.png";
import Mug from "./assets/mug.png";

const canvasWidth = 700;
const canvasHeight = 700;

function App() {
  const canvasRef = useRef();

  const [startXY, setStartCoordinates] = useState({ x: 0, y: 0 });
  const [isDragOk, setIsDragOk] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [backgroundSize, setBackgroundSize] = useState(200);
  const [productImageSize, setProductImageSize] = useState({
    width: 30,
    height: 30,
  });

  // FIRST TIME BACKGROUND IMAGE SELECTED
  const handleBackground = (file) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    image.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
      setBackgroundImage(image);
      URL.revokeObjectURL(image.src);
    };
    image.onerror = (err) => {
      console.error(err);
      URL.revokeObjectURL(image.src);
    };
  };

  // ON PRESS ROTATE BUTTON

  const handleRotate = () => {
    if (productImage) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(
        productImage.picture,
        productImage.x,
        productImage.y,
        productImage.height,
        productImage.width
      );

      setProductImage({
        ...productImage,
        width: productImage.height,
        height: productImage.width,
      });
    }
  };

  // FIRST TIME PRODUCT IMAGE SELECTED
  const handleProductImage = (file) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);

    const pictureWidth =
      (canvasWidth * productImageSize.width) / backgroundSize;
    const pictureHeight =
      (canvasHeight * productImageSize.height) / backgroundSize;
    const defaultPictureX = 0;
    const defaultPictureY = 0;

    image.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(
        image,
        defaultPictureX,
        defaultPictureY,
        pictureWidth,
        pictureHeight
      );

      const shine = new Image();
      shine.src = Shine;
      shine.onload = () => {
        ctx.drawImage(
          shine,
          defaultPictureX,
          defaultPictureY,
          pictureWidth,
          pictureHeight
        );
      };

      shine.onerror = (err) => {
        console.error(err);
      };

      setProductImage({
        picture: image,
        width: pictureWidth,
        height: pictureHeight,
        x: defaultPictureX,
        y: defaultPictureY,
      });
      URL.revokeObjectURL(image.src);
    };
    image.onerror = (err) => {
      console.error(err);
      URL.revokeObjectURL(image.src);
    };
  };

  const handleBackgroundSize = (event) => {
    setBackgroundSize(event.target.value);
  };

  const handleProductImageSize = (event) => {
    const [width, height] = event.target.value.split("x");
    setProductImageSize({ width, height });
  };

  // HANDLE CANVAS
  const handleCanvasMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const BB = canvasRef.current.getBoundingClientRect();
    const offsetX = BB.left;
    const offsetY = BB.top;

    const mx = parseInt(e.clientX - offsetX);
    const my = parseInt(e.clientY - offsetY);

    setIsDragOk(false);

    if (
      mx > productImage.x &&
      mx < productImage.x + productImage.width &&
      my > productImage.y &&
      my < productImage.y + productImage.height
    ) {
      setIsDragOk(true);
    }

    setStartCoordinates({ x: mx, y: my });
  };

  const handleCanvasMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragOk(false);
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragOk) {
      e.preventDefault();
      e.stopPropagation();
      const ctx = canvasRef.current.getContext("2d");

      const BB = canvasRef.current.getBoundingClientRect();
      const offsetX = BB.left;
      const offsetY = BB.top;
      const mx = parseInt(e.clientX - offsetX);
      const my = parseInt(e.clientY - offsetY);

      const dx = mx - startXY.x;
      const dy = my - startXY.y;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(
        productImage.picture,
        productImage.x + dx,
        productImage.y + dy,
        productImage.width,
        productImage.height
      );

      setProductImage({
        ...productImage,
        x: productImage.x + dx,
        y: productImage.y + dy,
      });

      setStartCoordinates({ x: mx, y: my });
    }
  };

  const handleMugImage = (file) => {
    const image = new Image();
    image.src = Mug;

    const mugPictureWidth = canvasWidth;
    const mugPictureHeight = canvasHeight;
    const defaultPictureX = 0;
    const defaultPictureY = 0;

    image.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(
        image,
        defaultPictureX,
        defaultPictureY,
        mugPictureWidth,
        mugPictureHeight
      );

      const print = new Image();
      print.src = URL.createObjectURL(file);

      print.onload = () => {
        const iw = print.width;
        const ih = print.height;

        const xOffset = 60, //left padding
          yOffset = 100; //top padding

        const a = 193; //image width
        const b = 20; //round ness

        const scaleFactor = iw / (3 * a);

        // draw vertical slices
        for (let X = 0; X < iw; X += 1) {
          const y = (b / a) * Math.sqrt(a * a - (X - a) * (X - a)); // ellipsis equation
          ctx.drawImage(
            print,
            X * scaleFactor,
            0,
            iw / 1.5,
            ih,
            X + xOffset,
            y + yOffset,
            1,
            500
          );
        }
      };

      print.onerror = (err) => {
        console.error(err);
      };

      URL.revokeObjectURL(image.src);
    };
    image.onerror = (err) => {
      console.error(err);
      URL.revokeObjectURL(image.src);
    };
  };

  return (
    <div className="App">
      <InputFile onSubmitFile={handleBackground} title="Upload Background" />
      <input
        type="range"
        min="200"
        max="500"
        onChange={handleBackgroundSize}
      ></input>
      <div>background size in centimeters: {backgroundSize}</div>
      <InputFile
        onSubmitFile={handleProductImage}
        title="Upload Product Image"
      />
      <select onChange={handleProductImageSize}>
        <option>30x30</option>
        <option>60x40</option>
        <option>20x50</option>
        <option>60x60</option>
        <option>100x70</option>
      </select>
      <button onClick={handleRotate}>Rotate</button>
      <InputFile onSubmitFile={handleMugImage} title="Upload Mug Image" />
      <canvas
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseDown={handleCanvasMouseDown}
        height={canvasHeight}
        width={canvasWidth}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default App;
