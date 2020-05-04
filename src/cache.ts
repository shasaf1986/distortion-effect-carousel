import { Cache } from 'three';

Cache.enabled = true;

export const setCache = (enabled: boolean) => {
  Cache.enabled = enabled;
};
