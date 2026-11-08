export const BASE_PATH = "/world-model-policy-value";
export const SITE_URL = `https://chankyo123.github.io${BASE_PATH}/`;
export const REPO_URL = "https://github.com/chankyo123/world-model-policy-value";
export function asset(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
