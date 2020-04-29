import {
  useRef,
  useMemo,
  MutableRefObject,
  useEffect,
  useState,
  useCallback,
} from 'react';
import {
  DistortionEffectCarouselPlugin,
  BackgroundSize,
} from './distortionEffectCarousel';

export interface UseDistortionEffectCarouselOptions<T> {
  ref?: MutableRefObject<T | null>;
  images: string[];
  displacmentImage: string;
  initialIndex?: number;
  backgroundSize?: BackgroundSize;
  displacmentBackgroundSize?: BackgroundSize;
}

function useDeepMemo<T>(factory: () => T, deps?: any[]) {
  return useMemo(factory, [JSON.stringify(deps)]);
}

export function useDistortionEffectCarousel<T extends HTMLElement>({
  images,
  displacmentImage,
  initialIndex = 0,
  ref,
  backgroundSize,
  displacmentBackgroundSize,
}: UseDistortionEffectCarouselOptions<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const pluginRef = useRef<DistortionEffectCarouselPlugin | null>(null);
  const additionalRef = useRef<T | null>(null);
  const actualRef = ref || additionalRef;
  const actualImages = useDeepMemo(() => images, [images]);

  useEffect(() => {
    if (!actualRef.current) {
      return;
    }
    if (actualImages.length === 0) {
      return;
    }

    const plugin = new DistortionEffectCarouselPlugin({
      initialIndex,
      images: actualImages,
      displacmentImage,
      parent: actualRef.current,
      backgroundSize,
      displacmentBackgroundSize,
    });
    pluginRef.current = plugin;
    setCurrentIndex(plugin.getCurrentIndex());

    return () => {
      plugin.dispose();
      pluginRef.current = null;
    };
  }, [
    actualRef,
    displacmentImage,
    actualImages,
    initialIndex,
    backgroundSize,
    displacmentBackgroundSize,
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
    }),
    [actualRef, currentIndex, jump, next, prev]
  );
}
