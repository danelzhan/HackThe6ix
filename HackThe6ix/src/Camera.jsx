import React, { useRef, useEffect, useState } from "react";
import { main } from './DrugScanParse.js'

export function Camera({}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [carousel, setCarousel] = useState(() => {
    // Load carousel from localStorage
    const saved = localStorage.getItem("carouselImages");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!photo) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [photo]);

    const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && carousel.length < 3) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");

        // Add to carousel and localStorage
        const updatedCarousel = [...carousel, image];
        setCarousel(updatedCarousel);
        localStorage.setItem("carouselImages", JSON.stringify(updatedCarousel));

        setPhoto(image);
    }
    };

    const retakePhoto = () => {
        setPhoto(null);
    };

    const submitPhotos = () => {
    if (carousel.length === 0) return;

    // Create a canvas to stitch images horizontally
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    // Load all images
    const images = carousel.map(src => {
        const img = new window.Image();
        img.src = src;
        return img;
    });

    // Wait for all images to load
    Promise.all(images.map(img => new Promise(resolve => {
        img.onload = () => resolve(img);
    }))).then(loadedImages => {
        // Calculate total width and max height
        const totalWidth = loadedImages.reduce((sum, img) => sum + img.width, 0);
        const maxHeight = Math.max(...loadedImages.map(img => img.height));

        tempCanvas.width = totalWidth;
        tempCanvas.height = maxHeight;

        // Draw images side by side
        let x = 0;
        loadedImages.forEach(img => {
        tempCtx.drawImage(img, x, 0, img.width, img.height);
        x += img.width;
        });

        // Save stitched image to localStorage
        const stitchedImage = tempCanvas.toDataURL("image/png");
        localStorage.setItem("stitchedImage", stitchedImage);

        // Clear carousel and localStorage
        setCarousel([]);
        localStorage.removeItem("carouselImages");
        setPhoto(null);

        alert("Photos stitched and saved!");
        main()
    });
    };

  const clearCarousel = () => {
    setCarousel([]);
    localStorage.removeItem("carouselImages");
    setPhoto(null);
  };

  const deletePhotoFromCarousel = (idx) => {
    const updatedCarousel = carousel.filter((_, i) => i !== idx);
    setCarousel(updatedCarousel);
    localStorage.setItem("carouselImages", JSON.stringify(updatedCarousel));
    // If the deleted photo is the main photo, reset
    if (photo === carousel[idx]) setPhoto(null);
  };

  return (
    <div>
      {!photo ? (
        <>
          <video ref={videoRef} autoPlay playsInline style={{ width: "30rem" }} />
          <button onClick={capturePhoto} disabled={carousel.length >= 3}>Capture Photo</button>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
      ) : (
        <>
          <img src={photo} alt="Captured" style={{ width: "30rem" }} />
          <div style={{ marginTop: "1rem" }}>
            <button onClick={retakePhoto}>Take Another</button>
            <button onClick={submitPhotos}>Submit</button>
          </div>
        </>
      )}

      {carousel.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Carousel</h3>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
            {carousel.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`carousel-${idx}`}
                style={{ width: "6rem", cursor: "pointer", border: photo === img ? "2px solid blue" : "1px solid #ccc" }}
                onClick={() => deletePhotoFromCarousel(idx)}
                title="Click to delete"
              />
            ))}
          </div>
          <button style={{ marginTop: "1rem" }} onClick={clearCarousel}>Clear Carousel</button>
        </div>
      )}
    </div>
  );
}