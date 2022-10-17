module.exports = async function getImageById(page, imageId) {
  return await page.evaluate((imageId) => {
    let img = document.getElementById(imageId);
    return {
      src: img.src,
      currentSrc: img.currentSrc,
      naturalWidth: img.naturalWidth,
      width: img.width,
    };
  }, imageId);
};
