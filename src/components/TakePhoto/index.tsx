import React from "react";
import styles from './styles.module.css';

interface TakePhotoProps {
    onTake(photoBase64: string): void;
    size?: number;
}

const width = 320; // We will scale the photo width to this




const TakePhoto: React.FC<TakePhotoProps> = ({ onTake, size = 100 }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const divRef = React.useRef<HTMLDivElement>(null)
    const streamRef = React.useRef<MediaStream>()

    React.useEffect(() => {

        navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
            if (!videoRef.current) {
                return;
            }
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            streamRef.current = stream;
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });

        return () => {
            if (!streamRef.current) {return;}
            streamRef.current.getTracks().forEach(function(track) {
                track.stop();
              });
        }
    }, [])

    return (<div className={styles.takePhoto}>
    <video ref={videoRef} onCanPlay={(e) => {
        const video = e.currentTarget;
        let height = video.videoHeight / (video.videoWidth / width);
        if (isNaN(height)) {
            height = width / (4 / 3);
        }

        if (!canvasRef.current) return;

        video.setAttribute("width", width.toString());
        video.setAttribute("height", height.toString());

        canvasRef.current.setAttribute("width", width.toString());
        canvasRef.current.setAttribute("height", height.toString());

    }}>Video stream not available.</video>
    <canvas ref={canvasRef} width={size} height={size}></canvas>
    <button onClick={() => {
        if (!canvasRef.current || !videoRef.current) return;
        const canvas = canvasRef.current;

        const height = videoRef.current.height;
        

        const context = canvas.getContext("2d");
        
        if (width && height && context) {
            context.clearRect(0, 0, canvas.width,canvas.height);
          
          context.drawImage(
            videoRef.current,
            0,
            0,
            width,
            height,
        );
    
          const data = canvas.toDataURL("image/png");
          onTake(data);
        }
    }}>Take photo</button>
  </div>);
}
 
export default TakePhoto;