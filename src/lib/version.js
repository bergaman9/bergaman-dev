/**
 * Get the current application version
 * Always returns consistent version to avoid hydration mismatch
 */
export function getAppVersion() {
  // Always use environment variable first for consistency
  const envVersion = process.env.NEXT_PUBLIC_APP_VERSION;
  if (envVersion) {
    return envVersion;
  }

  // Fallback: try to read from package.json only on server-side
  if (typeof window === 'undefined') {
    try {
      // Use dynamic import instead of require to avoid initialization issues
      // This is safer in Next.js environment and prevents the 'y' reference error
      const { version } = JSON.parse(process.env.npm_package_json || '{"version":"2.5.13"}');
      return `v${version}`;
    } catch (error) {
      console.warn('Could not read version from package.json:', error);
    }
  }
  
  // Final fallback - updated to current version
  return 'v2.5.13';
}

/**
 * Get version info with additional metadata
 */
export function getVersionInfo() {
  const version = getAppVersion();
  const buildDate = process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split('T')[0];
  const environment = process.env.NODE_ENV || 'development';
  
  return {
    version,
    buildDate,
    environment,
    fullVersion: `${version} (${environment})`,
    displayVersion: version
  };
}

/**
 * Compare version strings
 * Returns: -1 if v1 < v2, 0 if equal, 1 if v1 > v2
 */
export function compareVersions(v1, v2) {
  // Remove 'v' prefix if present
  const clean1 = v1.replace(/^v/, '');
  const clean2 = v2.replace(/^v/, '');
  
  const parts1 = clean1.split('.').map(Number);
  const parts2 = clean2.split('.').map(Number);
  
  const maxLength = Math.max(parts1.length, parts2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const part1 = parts1[i] || 0;
    const part2 = parts2[i] || 0;
    
    if (part1 < part2) return -1;
    if (part1 > part2) return 1;
  }
  
  return 0;
}

/**
 * Check if version is newer than current
 */
export function isNewerVersion(newVersion, currentVersion = getAppVersion()) {
  return compareVersions(newVersion, currentVersion) > 0;
} 