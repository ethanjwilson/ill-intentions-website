import { useNextSanityImage, UseNextSanityImageProps } from "next-sanity-image";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Box } from "@chakra-ui/react";

import useLiquidEffect from "../hooks/useLiquidEffect";
import { client } from "../utils/sanityClient";

const LiquidImage = ({ images, name }: { images: any; name: string }) => {
  const [isLoading, setIsloading] = useState(true);
  const imageRef = useRef<HTMLDivElement>(null);
  const firstImageProps: UseNextSanityImageProps = useNextSanityImage(client, images[0]);

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
        <Image {...firstImageProps} priority placeholder="blur" layout="fixed" alt={`Picture of ${name}`} width={500} height={500} onLoadingComplete={() => setIsloading(false)} />
      </Box>
      <Box position="absolute" inset="0" transition="opacity 500ms ease-in-out" ref={imageRef} width={500} height={500} style={{ opacity: isLoading ? "0" : "1" }}></Box>
    </Box>
  );
};

export default LiquidImage;
