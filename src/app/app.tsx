import React, { FC } from 'react';
import { displacementImages } from './images';
import { useDistortionEffectCarousel } from './useDistortionEffectCarousel';

const images = [
  'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?cs=srgb&dl=adventure-calm-clouds-dawn-414171.jpg&fm=jpg',
  'https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
  'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?cs=srgb&dl=blue-sky-clear-sky-cold-fog-346529.jpg&fm=jpg',
  'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?cs=srgb&dl=mirror-lake-reflecting-wooden-house-in-middle-of-lake-147411.jpg&fm=jpg',
  'https://images.pexels.com/photos/371589/pexels-photo-371589.jpeg?cs=srgb&dl=clouds-daylight-forest-grass-371589.jpg&fm=jpg',
  'https://images.pexels.com/photos/210186/pexels-photo-210186.jpeg?cs=srgb&dl=time-lapse-photography-of-waterfalls-during-sunset-210186.jpg&fm=jpg',
  'https://images.pexels.com/photos/248771/pexels-photo-248771.jpeg?cs=srgb&dl=panoramic-view-of-sea-against-blue-sky-248771.jpg&fm=jpg',
  'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?cs=srgb&dl=astronomy-beautiful-clouds-constellation-355465.jpg&fm=jpg',
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?cs=srgb&dl=beautiful-calm-clouds-dark-206359.jpg&fm=jpg',
  'https://images.pexels.com/photos/462162/pexels-photo-462162.jpeg?cs=srgb&dl=aerial-view-beach-beautiful-cliff-462162.jpg&fm=jpg',
  'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?cs=srgb&dl=alberta-amazing-attraction-banff-417074.jpg&fm=jpg',
];
const App: FC = () => {
  const { ref, currentIndex, next, prev } = useDistortionEffectCarousel<
    HTMLDivElement
  >({
    displacmentImage: displacementImages[5],
    images,
  });
  console.log(currentIndex);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          prev();
        }}
      >
        back
      </button>
      <button
        type="button"
        onClick={() => {
          next();
        }}
      >
        next
      </button>
      <div style={{ height: '100vh' }} ref={ref} />
    </div>
  );
};

export default App;
