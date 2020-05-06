import {
  useRef,
  useMemo,
  MutableRefObject,
  useState,
  useCallback,
} from 'react';
import { useDeepCompareEffect } from 'react-use';
import {
  DistortionEffectCarouselPlugin,
  DistortionEffectCarouselPluginOptions,
} from './distortionEffectCarouselPlugin';

export interface UseDistortionEffectCarouselOptions<
  T extends HTMLElement = HTMLDivElement
>
  extends Pick<
    DistortionEffectCarouselPluginOptions,
    | 'images'
    | 'displacmentImage'
    | 'initialIndex'
    | 'backgroundSize'
    | 'displacmentBackgroundSize'
    | 'commonAngle'
    | 'easing'
    | 'intensity'
    | 'resizeDebounce'
    | 'speed'
    | 'angle1'
    | 'angle2'
    | 'dpr'
  > {
  ref?: MutableRefObject<T | null>;
}

export function useDistortionEffectCarousel<
  T extends HTMLElement = HTMLDivElement
>({
  ref,
  images,
  displacmentImage,
  initialIndex = 0,
  backgroundSize,
  displacmentBackgroundSize,
  commonAngle,
  easing,
  intensity,
  resizeDebounce,
  speed,
  angle1,
  angle2,
  dpr,
}: UseDistortionEffectCarouselOptions<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // loadedImages[0] === true, indicates that the first image is loaded
  const [loadedImages, setLoadedImages] = useState<
    Partial<Record<number, boolean>>
  >({});
  const pluginRef = useRef<DistortionEffectCarouselPlugin | null>(null);
  const defaultRef = useRef<T | null>(null);
  const actualRef = ref || defaultRef;

  // deep compare becuase the images could pass as a new array every render
  useDeepCompareEffect(() => {
    // in this time, the ref should be populated
    if (!actualRef.current) {
      console.warn('ref is missing');
      return;
    }
    if (images.length === 0) {
      return;
    }

    const onImageLoaded = (index: number) => {
      setLoadedImages((prev) => ({
        ...prev,
        [index]: true,
      }));
    };

    const plugin = new DistortionEffectCarouselPlugin({
      initialIndex,
      images,
      displacmentImage,
      parent: actualRef.current,
      backgroundSize,
      displacmentBackgroundSize,
      commonAngle,
      easing,
      intensity,
      resizeDebounce,
      speed,
      onImageLoaded,
      angle1,
      angle2,
      dpr,
    });
    pluginRef.current = plugin;
    // this is necessary if the plugin was created before or the initialIndex is not valid
    setCurrentIndex(plugin.getCurrentIndex());
    // this is necessary if the plugin was created before
    setLoadedImages({});

    return () => {
      plugin.dispose();
      pluginRef.current = null;
    };
  }, [
    actualRef,
    displacmentImage,
    images,
    initialIndex,
    backgroundSize,
    displacmentBackgroundSize,
    commonAngle,
    easing,
    intensity,
    resizeDebounce,
    speed,
    angle1,
    angle2,
    dpr,
  ]);

  const next = useCallback(() => {
    const { current: plugin } = pluginRef;
    if (!plugin) {
      return;
    }
    plugin.next();
    setCurrentIndex(plugin.getCurrentIndex());
  }, []);

  const prev = useCallback(() => {
    const { current: plugin } = pluginRef;
    if (!plugin) {
      return;
    }
    plugin.prev();
    setCurrentIndex(plugin.getCurrentIndex());
  }, []);

  const jump = useCallback((index: number) => {
    const { current: plugin } = pluginRef;
    if (!plugin) {
      return;
    }
    plugin.jump(index);
    setCurrentIndex(plugin.getCurrentIndex());
  }, []);

  return useMemo(
    () => ({
      currentIndex,
      next,
      prev,
      jump,
      ref: actualRef,
      loadedImages,
    }),
    [actualRef, currentIndex, jump, loadedImages, next, prev]
  );
}
