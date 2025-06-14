// Get client IP address from request
export function getClientIP(request) {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  // Fallback to connection remote address
  return request.ip || 'unknown';
}

// Parse User Agent string
export function parseUserAgent(userAgent) {
  if (!userAgent) {
    return {
      browser: { name: null, version: null },
      os: { name: null, version: null },
      device: { type: null, vendor: null, model: null }
    };
  }

  const result = {
    browser: { name: null, version: null },
    os: { name: null, version: null },
    device: { type: 'desktop', vendor: null, model: null }
  };

  // Browser detection
  if (userAgent.includes('Chrome')) {
    result.browser.name = 'Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  } else if (userAgent.includes('Firefox')) {
    result.browser.name = 'Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    result.browser.name = 'Safari';
    const match = userAgent.match(/Version\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  } else if (userAgent.includes('Edge')) {
    result.browser.name = 'Edge';
    const match = userAgent.match(/Edge\/([0-9.]+)/);
    if (match) result.browser.version = match[1];
  }

  // OS detection
  if (userAgent.includes('Windows NT')) {
    result.os.name = 'Windows';
    const match = userAgent.match(/Windows NT ([0-9.]+)/);
    if (match) {
      const version = match[1];
      if (version === '10.0') result.os.version = '10';
      else if (version === '6.3') result.os.version = '8.1';
      else if (version === '6.2') result.os.version = '8';
      else if (version === '6.1') result.os.version = '7';
      else result.os.version = version;
    }
  } else if (userAgent.includes('Mac OS X')) {
    result.os.name = 'macOS';
    const match = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (match) result.os.version = match[1].replace(/_/g, '.');
  } else if (userAgent.includes('Linux')) {
    result.os.name = 'Linux';
  } else if (userAgent.includes('Android')) {
    result.os.name = 'Android';
    const match = userAgent.match(/Android ([0-9.]+)/);
    if (match) result.os.version = match[1];
    result.device.type = 'mobile';
  } else if (userAgent.includes('iPhone')) {
    result.os.name = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    if (match) result.os.version = match[1].replace(/_/g, '.');
    result.device.type = 'mobile';
    result.device.vendor = 'Apple';
    result.device.model = 'iPhone';
  } else if (userAgent.includes('iPad')) {
    result.os.name = 'iOS';
    const match = userAgent.match(/OS ([0-9_]+)/);
    if (match) result.os.version = match[1].replace(/_/g, '.');
    result.device.type = 'tablet';
    result.device.vendor = 'Apple';
    result.device.model = 'iPad';
  }

  // Mobile detection
  if (userAgent.includes('Mobile') && !result.device.vendor) {
    result.device.type = 'mobile';
  }

  return result;
}

// Get location info from IP
export async function getLocationFromIP(ip) {
  if (!ip || ip === 'unknown' || ip === '127.0.0.1' || ip === '::1') {
    return null;
  }

  try {
    // Using ip-api.com (free service, 1000 requests per month)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as`, {
      timeout: 5000
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        org: data.org,
        as: data.as
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching location data:', error);
    return null;
  }
}

// Get all user info
export async function getUserInfo(request) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || null;
  
  const deviceInfo = parseUserAgent(userAgent);
  const locationInfo = await getLocationFromIP(ip);
  
  return {
    ipAddress: ip,
    userAgent,
    referrer,
    ...deviceInfo,
    location: locationInfo
  };
} 