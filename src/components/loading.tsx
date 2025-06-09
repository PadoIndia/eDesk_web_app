import Lottie from "lottie-react";
import loadingData from "../assets/lottie/loading.json";

export default function Loading() {
  return (
    <div
      className="position-fixed vh-100 vw-100 d-flex justify-content-center align-items-center top-0 left-0 end-0 right-0"
      style={{
        zIndex: 99,
      }}
    >
      <div style={{ height: "200px", width: "200px" }}>
        <Lottie animationData={loadingData} autoPlay />
      </div>
    </div>
  );
}
