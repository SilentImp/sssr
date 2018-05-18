import Config from 'Config';

export const getSrcFromScreenshots = (screenshots = [], id = 334, query = '') => {
  const thumbScreen = screenshots.find(screenshot => (
    screenshot.scr_type_id === id
  ));

  if (thumbScreen) {
    const {
      templ_id: thumbTeplateId,
      filename: thumbFilename,
    } = thumbScreen;

    return `${Config.tmimgcdnURL}${Math.floor(thumbTeplateId / 100) * 100}/${thumbFilename}${query}`;
  }

  return null;
};

export default getSrcFromScreenshots;
