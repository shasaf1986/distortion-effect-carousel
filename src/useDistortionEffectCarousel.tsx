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
} from './distortionEffectCarousel';

export interface UseDistortionEffectCarouselOptions<T>
  extends Omit<DistortionEffectCarouselPluginOptions, 'parent'> {
  ref?: MutableRefObject<T | null>;
}

export function useDistortionEffectCarousel<T extends HTMLElement>({
  images,
  displacmentImage,
  initialIndex = 0,
  ref,
  backgroundSize,
  displacmentBackgroundSize,
  commonAngle,
  easing,
  intensity,
  resizeDebounce,
  speed,
}: UseDistortionEffectCarouselOptions<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const pluginRef = useRef<DistortionEffectCarouselPlugin | null>(null);
  const additionalRef = useRef<T | null>(null);
  const actualRef = ref || additionalRef;

  useDeepCompareEffect(() => {
    if (!actualRef.current) {
      return;
    }
    if (images.length === 0) {
      return;
    }

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
    images,
    initialIndex,
    backgroundSize,
    displacmentBackgroundSize,
    commonAngle,
    easing,
    intensity,
    resizeDebounce,
    speed,
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
