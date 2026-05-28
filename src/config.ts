export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:5000");

export function getImageUrl(path: string | undefined | null): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Convert Windows backslashes to forward slashes
  const normalizedPath = path.replace(/\\/g, '/');
  
  // Ensure absolute path by adding a leading slash if missing
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;
  
  // Prefix with API_URL if it's set
  if (API_URL) {
    const cleanApiUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    return cleanApiUrl + cleanPath;
  }
  
  return cleanPath;
}
