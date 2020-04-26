import {
  useRef,
  useMemo,
  MutableRefObject,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { PlasticTransitionPlugin } from './plugin';

export interface UseDistortionEffectCarouselOptions<T> {
  ref?: MutableRefObject<T | null>;
  images: string[];
  displacmentImage: string;
  initialIndex?: number;
}

function useDeepMemo<T>(factory: () => T, deps?: any[]) {
  return useMemo(factory, [JSON.stringify(deps)]);
}

export function useDistortionEffectCarousel<T extends HTMLElement>({
  images,
  displacmentImage,
  initialIndex = 0,
  ref,
}: UseDistortionEffectCarouselOptions<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const pluginRef = useRef<PlasticTransitionPlugin | null>(null);
  const additionalRef = useRef<T | null>(null);
  const actualRef = ref || additionalRef;
  const actualImages = useDeepMemo(() => images, [images]);

  useEffect(() => {
    if (!actualRef.current) {
      return;
    }

    const plugin = new PlasticTransitionPlugin({
      initialIndex,
      images: actualImages,
      displacmentImage,
      parent: actualRef.current,
    });
    pluginRef.current = plugin;

    return () => {
      plugin.dispose();
      pluginRef.current = null;
    };
  }, [actualRef, displacmentImage, actualImages, initialIndex]);

  const next = useCallback(() => {
    const { current: plugin } = pluginRef;
    if (plugin) {
      plugin.next();
      setCurrentIndex(plugin.getCurrentIndex());
    }
  }, []);

  const prev = useCallback(() => {
    const { current: plugin } = pluginRef;
    if (plugin) {
      plugin.prev();
      setCurrentIndex(plugin.getCurrentIndex());
    }
  }, []);

  const jump = useCallback((index: number) => {
    const { current: plugin } = pluginRef;
    if (plugin) {
      plugin.jump(index);
      setCurrentIndex(plugin.getCurrentIndex());
    }
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
