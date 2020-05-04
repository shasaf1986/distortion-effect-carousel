import { Cache } from 'three';

export const setCache = (enabled: boolean) => {
  Cache.enabled = enabled;
};

setCache(true);
