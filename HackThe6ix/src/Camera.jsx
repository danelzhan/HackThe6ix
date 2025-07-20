import React, { useRef, useEffect, useState } from "react";
import {main} from "./DrugScanParse.js"
import { height } from "@mui/system";
import ManualInputButton from "./Components/Button.jsx";
import { postNode } from "./Bridge.js";
import { Drug } from "./Objects.js";

export function Camera( {updateDrugs, user} ) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  console.log("first" + user)

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

    async function capturePhoto(user) {
      console.log("took pic")
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
          const drug = await main()
          console.log(drug)

          postNode(drug, user)

          console.log(user)

      }
    };

  const retakePhoto = () => {
    setPhoto(null);
  };

  return (
    <>
      <div className="camera_text" style={{ pointerEvents: "none" }}>
        <div>
          <p id="camera_label">Scan the label on your medication</p>
          <p id="camera_subtext">Tap anywhere to take a photo</p>
        </div>
        <ManualInputButton onClick={() => {console.log("clicked")}} label={"Manually input info instead"} style={{ pointerEvents: "auto" }}/>
      </div>

      <div id="video_container">
        {
          <>
            <video onClick={() => {console.log("Video feed clicked - capturing photo"); capturePhoto(user);}} ref={videoRef} autoPlay playsInline style={{ height: "100vh" }} />
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </>
        }
      </div>
    </>

  );
}