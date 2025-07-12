import { lazy, Suspense, useEffect, useState } from "react";

const Lottie = lazy(() => import("lottie-react"));
const loadAnimationData = () => import("../assets/lottie/loading.json");

export default function Loading() {
  return (
    <Suspense>
      <LottieLoader />
    </Suspense>
  );
}

function LottieLoader() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    loadAnimationData().then((data) => setAnimationData(data.default));
  }, []);

  if (!animationData) return null;

  return (
    <div
      className="position-fixed vh-100 vw-100 d-flex justify-content-center align-items-center top-0 left-0 end-0 right-0"
      style={{ zIndex: 99 }}
    >
      <div style={{ height: "200px", width: "200px" }}>
        <Lottie animationData={animationData} autoPlay />
      </div>
    </div>
  );
}

export const Spinner = () => (
  <div className="d-flex justify-content-center align-items-center">
    <div className="text-center">
      <div className="spinner-border text-primary mb-3" role="status"></div>
    </div>
  </div>
);
