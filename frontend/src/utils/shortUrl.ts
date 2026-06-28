const DEFAULT_SHORT_BASE_URL = "http://localhost:5000";

export const SHORT_LINK_PREFIX = "/r";

const getShortBaseUrl = () => {
  const configuredBase = import.meta.env.VITE_SHORT_BASE_URL;
  return (configuredBase || DEFAULT_SHORT_BASE_URL).replace(/\/+$/, "");
};

export const getShortPath = (shortCode: string) =>
  `${SHORT_LINK_PREFIX}/${shortCode}`;

export const buildShortUrl = (shortCode: string) =>
  `${getShortBaseUrl()}${getShortPath(shortCode)}`;
