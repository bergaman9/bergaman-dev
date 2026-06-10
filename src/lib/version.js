import packageJson from '../../package.json';

/**
 * Get the current application version.
 * Single source of truth: NEXT_PUBLIC_APP_VERSION (injected from package.json
 * by next.config.mjs at build time), falling back to package.json directly.
 */
export function getAppVersion() {
  const envVersion = process.env.NEXT_PUBLIC_APP_VERSION;
  if (envVersion) {
    return envVersion.replace(/^v/, '');
  }
  return packageJson.version;
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
