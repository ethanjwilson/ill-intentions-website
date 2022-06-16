import { MutableRefObject, useEffect, useState } from "react";

import imageUrlBuilder from "@sanity/image-url";

import effect from "../utils/effect";
import { client } from "../utils/sanityClient";

const useLiquidEffect = (images: [any, any], displacementImage: string, imageRef: MutableRefObject<HTMLDivElement>) => {
  const [liquidEffect, setLiquidEffect] = useState<any>(null);

  useEffect(() => {
    if (imageRef && !liquidEffect) {
      console.log("Creating liquid effect");
      const builder = imageUrlBuilder(client);
      const urlFor = (source) => {
        return builder.image(source);
      };
      const image1Url = urlFor(images[0]).width(1000).url();
      const image2Url = urlFor(images[1]).width(1000).url();

      const getImages = async () => {
        const image1 = await fetch(image1Url).then(async (image) => {
          const blob = await image.blob();
          return await new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        });

        const image2 = await fetch(image2Url).then(async (image) => {
          const blob = await image.blob();
          return await new Promise((resolve) => {
            let reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        });

        const le = new effect({
          parent: imageRef.current,
          intensity: 0.5,
          image1: image1,
          image2: image2,
          displacementImage,
        });
        setLiquidEffect(le);
      };

      getImages();
    }
    return () => {};
  }, [imageRef]);

  return liquidEffect;
};

export default useLiquidEffect;
