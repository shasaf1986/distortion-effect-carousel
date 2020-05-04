// based on https://gist.github.com/MonsieurV/fb640c29084c171b4444184858a91bc7
if (typeof window !== 'undefined' && !('createImageBitmap' in window)) {
  // @ts-ignore
  window.createImageBitmap = (data: any) =>
    new Promise((resolve, reject) => {
      let dataURL: any;
      if (data instanceof Blob) {
        dataURL = URL.createObjectURL(data);
      } else if (data instanceof ImageData) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('2d context is not defined');
        }
        canvas.width = data.width;
        canvas.height = data.height;
        context.putImageData(data, 0, 0);
        dataURL = canvas.toDataURL();
      } else {
        throw new Error(
          'createImageBitmap does not handle the provided image source type'
        );
      }
      const img = document.createElement('img');
      img.addEventListener('load', () => {
        resolve(img);
      });
      img.addEventListener('error', (error) => {
        reject(error);
      });
      img.src = dataURL;
    });
}
// for typescript
export {};
