import React, { useRef, useEffect, useState } from "react";
import {main} from "./DrugScanParse.js"
import { height } from "@mui/system";
import ManualInputButton from "./Components/Button.jsx";

export function Camera( {updateDrugs, user} ) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (!photo) {
      // Ask for camera access
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
      // Stop camera stream when photo is taken
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
    if (video && canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");

        // Save to local storage
        localStorage.setItem("capturedImage", image);

        setPhoto(image);
    }
    };

  const retakePhoto = () => {
    setPhoto(null);
  };

  return (
    <>
      <div className="camera_text">
        <>
          <p id="camera_label">Scan the label on your medication</p>
          <p id="camera_subtext">Tap anywhere to take a photo</p>
        </>
        <ManualInputButton onClick = {console.log("clicked")} label={"Manually input info instead"}/>
      </div>

      <div id="video_container">
        {!photo ? (
          <>
            <video ref={videoRef} autoPlay playsInline style={{ height: "100vh" }} />
            <button onClick={capturePhoto}>Capture Photo</button>
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        ) : (
          <>
            <img src={photo} alt="Captured" style={{ width: "30rem" }} />
            <button onClick={retakePhoto}>Retake Photo</button>
            <button onClick={() => {
                
              }}>Submit</button>
          </>
        )}
    </div>
    </>

  );
}