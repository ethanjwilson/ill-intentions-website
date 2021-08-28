import { MutableRefObject, useLayoutEffect, useState } from "react";
import effect from "../utils/effect";
import { imageLoader } from "../utils/imageLoader";

const useLiquidEffect = (images: string[], displacementImage: string, imageRef: MutableRefObject<HTMLDivElement>) => {
  const [liquidEffect, setLiquidEffect] = useState<any>(null);
  useLayoutEffect(() => {
    if (imageRef && !liquidEffect) {
      const le = new effect({
        parent: imageRef.current,
        intensity: 0.5,
        image2: imageLoader({ src: `${images[1]}.webp`, width: 1250, imageType: "webp" }),
        image1: imageLoader({ src: `${images[0]}.webp`, width: 1250, imageType: "webp" }),
        displacementImage,
      });
      setLiquidEffect(le);
    }
    return () => {};
  }, [imageRef]);

  return liquidEffect;
};

export default useLiquidEffect;
