export function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

export async function getCroppedImgBlob(imageSrc, cropArea) {
  const image = await createImage(imageSrc);
  const { width, height, x, y } = cropArea;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const scaleBg = Math.max(width / image.width, height / image.height);
  const bgWidth = image.width * scaleBg;
  const bgHeight = image.height * scaleBg;
  const bgX = (width - bgWidth) / 2;
  const bgY = (height - bgHeight) / 2;
  ctx.filter = 'blur(10px)';
  ctx.drawImage(image, 0, 0, image.width, image.height, bgX, bgY, bgWidth, bgHeight);
  ctx.filter = 'none';

  const srcX = x < 0 ? 0 : x;
  const srcY = y < 0 ? 0 : y;
  const destX = x < 0 ? -x : 0;
  const destY = y < 0 ? -y : 0;
  const srcWidth = x < 0 ? width + x : width;
  const srcHeight = y < 0 ? height + y : height;

  ctx.drawImage(image, srcX, srcY, srcWidth, srcHeight, destX, destY, srcWidth, srcHeight);

  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), 'image/jpeg');
  });
}