import React, { useRef, useState, useEffect } from "react";
import { Button, Card, Select, Space, Image, Typography, message } from "antd";

const { Option } = Select;
const { Title } = Typography;

export default function CheckinCheckoutPage() {
  const [mode, setMode] = useState("checkin");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      message.error("Không thể truy cập camera");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/png");
      setPhotoDataUrl(imageDataUrl);
      setHasPhoto(true);
      stopCamera(); // tắt camera sau khi chụp
    }
  };

  const retakePhoto = () => {
    setHasPhoto(false);
    setPhotoDataUrl(null);
    startCamera();
  };

  const handleSubmit = () => {
    if (!photoDataUrl) {
      message.error("Bạn cần chụp ảnh trước khi gửi");
      return;
    }

    // TODO: gọi API gửi ảnh + mode (checkin/checkout)
    console.log("Gửi ảnh:", { mode, photo: photoDataUrl });

    message.success(`${mode === "checkin" ? "Check-in" : "Check-out"} thành công!`);
    setHasPhoto(false);
    setPhotoDataUrl(null);
    startCamera();
  };

  return (
    <div className="p-5 flex justify-center">
      <Card style={{ width: "100%" }}>
        <Title level={4} className="mt-0 mb-2">Chấm công</Title>

        <Space className="mb-5">
          <span className="font-bold">Loại:</span>
          <Select value={mode} onChange={setMode} className="w-150">
            <Option value="checkin">Check-in</Option>
            <Option value="checkout">Check-out</Option>
          </Select>
        </Space>

        {!hasPhoto ? (
          <div className="relative w-[90%] max-w-[700px] mx-auto">
            <video
              ref={videoRef}
              autoPlay
              className="w-full rounded-lg"
            />
            <canvas ref={canvasRef} hidden />
          </div>

        ) : (
          <div className="mb-3">
            <Image src={photoDataUrl} alt="Preview" width={"90%"} />
          </div>
        )}

        <div className="mt-4 flex justify-end gap-3">
          {!hasPhoto ? (
            <Button type="primary" onClick={takePhoto}>
              Chụp ảnh
            </Button>
          ) : (
            <>
              <Button onClick={retakePhoto}>Chụp lại</Button>
              <Button type="primary" onClick={handleSubmit}>
                Gửi
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
