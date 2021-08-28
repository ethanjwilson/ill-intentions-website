export const imageLoader = ({ src, width, imageType = "webp" }: { src: string; width: number; imageType?: "webp" | "jpeg" }): string =>
  `https://firebasestorage.googleapis.com/v0/b/ill-intentions.appspot.com/o/${imageType}%2F${width}px%2F${src}?alt=media&token=121eebf5-b318-4705-8bbf-9e80e597f231`;
