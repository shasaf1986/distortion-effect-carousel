import React, { FC } from 'react';
import { displacementImages } from './images';
import { useDistortionEffectCarousel } from './useDistortionEffectCarousel';

const Arrow: FC = () => (
  <div
    style={{
      top: '50%',
      left: '50%',
      position: 'absolute',
      transform: 'translate(-25%,-50%)',
      width: 0,
      height: 0,
      borderTop: '10px solid transparent',
      borderLeft: '20px solid #333',
      borderBottom: '10px solid transparent',
    }}
  />
);

const Circle: FC<{ onClick: () => void; style: React.CSSProperties }> = ({
  onClick,
  style,
  children,
}) => (
  <div
    onClick={onClick}
    style={{
      boxSizing: 'border-box',
      border: '3px solid gray',
      position: 'absolute',
      backgroundColor: '#fff',
      borderRadius: '100%',
      opacity: '0.7',
      cursor: 'pointer',
      transition: 'opacity 200ms ease-in-out',
      ...style,
    }}
  >
    {children}
  </div>
);

const ArrowButton: FC<{ isLeft: boolean; onClick: () => void }> = ({
  isLeft,
  onClick,
}) => (
  <Circle
    onClick={onClick}
    style={{
      width: '64px',
      height: '64px',
      top: '50%',
      left: isLeft ? 0 : '100%',
      transform: `translate(${isLeft ? 10 : -10}px,-50%) rotate(${
        isLeft ? 180 : 0
      }deg)`,
      marginLeft: isLeft ? 0 : '-64px',
    }}
  >
    <Arrow />
  </Circle>
);

const Indicator: FC<{ onClick: () => void; isActive: boolean }> = ({
  children,
  onClick,
  isActive,
}) => (
  <div
    style={{
      padding: '2.5px',
    }}
  >
    <Circle
      onClick={onClick}
      style={{
        width: '30px',
        height: '30px',
        color: '#333',
        lineHeight: '28px',
        textAlign: 'center',
        borderWidth: '2px',
        position: 'static',
        opacity: isActive ? 1 : 0.7,
      }}
    >
      {children}
    </Circle>
  </div>
);

const Indicators: FC<{
  images: string[];
  onClick: (index: number) => void;
  currentIndex: number;
}> = ({ images, onClick, currentIndex }) => (
  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      position: 'absolute',
      width: '100%',
      // marginTop: '-40px',
      transform: 'translateY(-100%)',
      padding: '0 10px 7.5px 10px',
      top: '100%',
      boxSizing: 'border-box',
    }}
  >
    {images.map((image, index) => (
      <Indicator
        isActive={currentIndex === index}
        key={image}
        onClick={() => {
          onClick(index);
        }}
      >
        {index + 1}
      </Indicator>
    ))}
  </div>
);

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
const App: FC<{ aspectRatio?: number }> = () => {
  const { ref, currentIndex, next, prev, jump } = useDistortionEffectCarousel<
    HTMLDivElement
  >({
    displacmentImage: displacementImages[5],
    images,
  });
  console.log(currentIndex);

  return (
    <div
      style={{
        boxSizing: 'border-box',
        padding: '20px',
        // backgroundColor: 'gray',
      }}
    >
      <div
        ref={ref}
        style={{
          boxShadow: '0 0 10px rgba(0,0,0,.3)',
          backgroundColor: 'gray',
          position: 'relative',
          width: 'calc(100vw - 40px)',
          height: 'calc(100vh - 40px)',
        }}
      >
        <ArrowButton onClick={prev} isLeft />
        <ArrowButton onClick={next} isLeft={false} />
        <Indicators
          currentIndex={currentIndex}
          onClick={jump}
          images={images}
        />
      </div>
    </div>
  );
};

export default App;
