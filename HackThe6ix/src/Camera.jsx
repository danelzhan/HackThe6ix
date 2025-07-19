import React, { useRef, useEffect, useState} from "react";

export function Camera({ setImage }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [captured, setCaptured] = useState(null);

    useEffect(() => {
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
    }, []);

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL("image/png");
            setCaptured(image);
        }
    }

    function base64ToBlob(base64, mime = "image/png") {

        const byteString = atob(base64.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mime });

    }

    return (
    <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: "30rem" }} />
        <button onClick={capturePhoto}>Capture Photo</button>
        <canvas ref={canvasRef} style={{ display: "none" }} />
        {captured && (
        <div>
            <img src={captured} alt="Captured" style={{ width: "10rem" }} />
            <a href={captured} download="captured.png">
            <button onClick={() =>  {
                var image = base64ToBlob(captured)
                setImage(image)
                }}>Download Photo</button>
            </a>
        </div>
        )}
    </div>
    );
}
