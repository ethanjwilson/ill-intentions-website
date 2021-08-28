import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useLiquidEffect from "../hooks/useLiquidEffect";
import { imageLoader } from "../utils/imageLoader";

const LiquidImage = ({ images, name }: { images: string[]; name: string }) => {
  const [isLoading, setIsloading] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);
  const liquidEffect = useLiquidEffect(images, "/heightMap.png", imageRef);

  useEffect(() => {
    setTimeout(() => {
      liquidEffect?.resize();
    }, 500);
    return () => {};
  }, [isLoading, setIsloading]);
  return (
    <Box position="relative">
      <Box transition="opacity 1000ms ease-in-out" opacity={!isLoading ? "0" : "1"}>
        <Image
          priority
          placeholder="blur"
          loader={imageLoader}
          blurDataURL={imageLoader({ src: `${images[0]}.webp`, width: 250 })}
          src={`${images[0]}.webp`}
          alt={`Picture of ${name}`}
          width={500}
          height={500}
          onLoadingComplete={() => setIsloading(false)}
        />
      </Box>
      <Box position="absolute" inset="0" transition="opacity 500ms ease-in-out" ref={imageRef} width={500} height={500} style={{ opacity: isLoading ? "0" : "1" }}></Box>
    </Box>
  );
};

export default LiquidImage;
