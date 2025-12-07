# Firefox Settings Analysis

## Overview

This document provides a comprehensive analysis of Firefox browser settings found in the `/firefox` directory. The configuration consists of two files:
- `prefs.js` (567 lines) - Runtime preferences automatically managed by Firefox
- `user.js` (246 lines) - User-defined preferences based on Betterfox configuration

## Configuration Source

The `user.js` file is based on **Betterfox v144**, a community-maintained Firefox configuration focused on performance, privacy, and usability improvements.

Repository: https://github.com/yokoffing/Betterfox

## Key Configuration Categories

### 1. Performance Optimization (FASTFOX)

#### Graphics & Rendering
- **Skia Font Cache**: `gfx.content.skia-font-cache-size = 32` (MB)
- **Canvas Acceleration**:
  - Cache items: 32,768
  - Cache size: 4,096 KB
- **WebGL Max Size**: 16,384 pixels
- **Hardware Acceleration**: Force-enabled via `layers.acceleration.force-enabled = true`
- **WebRender**: Enabled globally (`gfx.webrender.all = true`)

#### Cache Configuration

**Disk Cache**:
- Completely disabled (`browser.cache.disk.enable = false`)
- All caching moved to RAM for performance

**Memory Cache**:
- Capacity: 262,144 KB (~256 MB)
- Max entry size: 20,480 KB (~20 MB)
- Session history viewers: 4
- Undo tabs limit: 10

**Media Cache**:
- Max size: 524,288 KB (~512 MB)
- Combined limit: 1,048,576 KB (1 GB)
- Readahead limit: 600 seconds
- Resume threshold: 300 seconds

**Image Cache**:
- Size: 10,485,760 bytes (~10 MB)
- Decode bytes per iteration: 65,536 bytes (~64 KB)

#### Network Settings
- **Max connections**: 1,800 total
- **Persistent connections per server**: 10
- **Urgent start connections**: 5
- **Request max start delay**: 5ms
- **HTTP pacing**: Disabled for faster loading
- **DNS cache**:
  - 10,000 entries
  - 3,600 second expiration
- **SSL token cache**: 10,240 entries

#### Speculative Loading
All speculative loading features **disabled** for privacy and to reduce unnecessary network requests:
- HTTP speculative parallel limit: 0
- DNS prefetch: disabled
- DNS prefetch from HTTPS: disabled
- URL bar speculative connect: disabled
- Places speculative connect: disabled
- Prefetch next: disabled
- Network predictor: disabled (via `user.js`)

### 2. Security Configuration (SECUREFOX)

#### Tracking Protection
- **Content blocking category**: Strict mode
- **Tracking protection**: Enabled with allow list baseline
- **Email tracking protection**: Enabled
- **Social tracking protection**: Enabled
- **Fingerprinting protection**: Enabled
- **Bounce tracking protection**: Mode 1 (enabled)
- **Query stripping**: Enabled for normal and private browsing
- **Global Privacy Control (GPC)**: Enabled

#### Safe Browsing
**Mostly disabled** for privacy:
- Blocked URIs: disabled
- Downloads: disabled
- Remote downloads: disabled
- Malware protection: disabled
- Phishing protection: disabled

#### SSL/TLS Security
- **OCSP**: Disabled (`security.OCSP.enabled = 0`)
- **CSP reporting**: Disabled
- **Unsafe negotiation**: Treat as broken
- **0-RTT data**: Disabled (prevents replay attacks)
- **Deprecated TLS versions**: Enabled for compatibility
- **Safe negotiation required**: Yes
- **DHE-RSA ciphers**: Enabled for compatibility

#### Certificate Handling
- **Expert bad cert pages**: Enabled
- **Remote settings intermediates**: Disabled
- **MITM priming**: Disabled

#### Mixed Content
- **Block display content**: Enabled
- **File URI strict origin policy**: Disabled

### 3. Privacy Configuration

#### DNS over HTTPS (DoH)
- **Provider**: DNSWarden (`https://dns.dnswarden.com/00000000000000000000048`)
- **Mode**: 2 (TRR preferred over native DNS)
- **Heuristics**: Disabled
- **Home region**: RU (Russia)

Note: Also configured with Cloudflare DoH as fallback (`https://mozilla.cloudflare-dns.com/dns-query`)

#### Search & URL Bar
- **Search suggestions**: Disabled
- **Quick suggest**: Disabled
- **Trending**: Disabled
- **Group labels**: Disabled
- **Form autofill**: Disabled
- **IDN punycode**: Always shown (anti-phishing)
- **HTTPS trimming**: Enabled with untrim on user interaction

#### Passwords & Forms
- **Formless capture**: Disabled
- **Private browsing capture**: Disabled
- **Auto-fill forms**: Disabled
- **Subresource HTTP auth**: Allowed (value 1)

#### Container Tabs
- **User contexts**: Enabled
- **UI**: Enabled
- Allows isolation of different browsing sessions

#### Session & History
- **Session store interval**: 60,000ms (1 minute)
- **Resume from crash**: Disabled
- **Custom history**: Enabled
- **Reset PBM**: Enabled
- **Startup page**: 3 (restore previous session)

#### Permissions
- **Desktop notifications**: Blocked (value 2)
- **Geolocation**: Blocked (value 2)
- **Geo provider URL**: beacondb.net (non-Google alternative)

#### Download Behavior
- **Start in temp dir**: Enabled
- **Delete temp files on exit**: Enabled
- **Add to recent docs**: Disabled
- **Last download directory**: /home/dima/Desktop

### 4. Telemetry & Data Collection

All Mozilla telemetry and data collection features are **completely disabled**:

- Health report: disabled
- Telemetry unified: disabled
- Telemetry server: `data:,` (dummy endpoint)
- Archive: disabled
- All ping types: disabled (new profile, shutdown, update, bhr, first shutdown)
- Coverage reporting: disabled and opted out
- Usage upload: disabled
- Data submission: disabled
- Policy notification: bypassed

**Experiments & Studies**:
- Shield opt-out studies: disabled
- Normandy: disabled
- Normandy API URL: empty string

**Crash Reports**:
- Breakpad URL: empty string
- Tab crash reporting: disabled

### 5. Mozilla UI & Features (PESKYFOX)

#### Disabled Mozilla Services
- VPN promo: disabled
- Extension recommendations: disabled
- Discovery pane: disabled
- Default browser check: disabled
- CFR (Contextual Feature Recommender): disabled for addons and features
- "More from Mozilla": disabled
- About:config warning: disabled
- Welcome page: disabled
- Firefox View: shown once (count: 1)

#### AI Features
All AI features **completely disabled**:
- ML enable: disabled
- ML chat: disabled
- ML chat menu: disabled
- Smart tab groups: disabled
- Link preview: disabled (via `user.js`)

#### New Tab Page
- **Default sites**: Empty
- **Sponsored top sites**: Disabled
- **Sponsored content**: Disabled
- **Top stories**: Disabled
- **Search bar**: Hidden
- **Highlights bookmarks**: Disabled
- **Highlights downloads**: Disabled

#### Tab Behavior
- **Close window with last tab**: Disabled
- **Warn on close other tabs**: Disabled
- **Warn on open**: Disabled
- **Tabs in titlebar**: Enabled (value 1)

### 6. Developer Tools Configuration

Extensive DevTools customization detected:

- **Host**: Right side
- **Selected tool**: Web Console
- **Footer height**: 418px
- **Sidebar width**: 610px
- **Responsive design mode**: Enabled with custom devices
- **Touch simulation**: Enabled
- **Default user agent**: iPhone (iOS 14.6)
- **Self XSS count**: 5 (warnings bypassed)
- **Network monitor**: Custom column configuration with XHR filter
- **Performance recording**: Custom preset with multiple features

### 7. Extensions & Add-ons

#### Extension Policy
- **Auto-disable scopes**: 0 (nothing auto-disabled)
- **Enabled scopes**: 5
- **Install distro addons**: Disabled
- **Tampermonkey**: Enabled

#### Detected Extensions (40+ extensions)
Major extensions include:
- **uBlock Origin** (`uBlock0@raymondhill.net`)
- **Dark Reader** (`addon@darkreader.org`)
- **FoxyProxy** (`foxyproxy@eric.h.jung`)
- **Tampermonkey** (`firefox@tampermonkey.net`)
- **SponsorBlocker** (`sponsorBlocker@ajay.app`)
- **CORS Everywhere** (`cors-everywhere@spenibus`)
- **User Agent Switcher**
- **Browsec VPN**
- **Authenticator**
- **Wappalyzer**
- Various other privacy and development tools

#### Extension Updates
- **Background updates**: Disabled (dummy URL)
- **Update checks**: Disabled
- **User notifications**: Disabled

### 8. Proxy Configuration

Current proxy settings in `prefs.js`:

- **Type**: 0 (No proxy / Direct connection)
- **HTTP proxy**: 127.0.0.1:8888 (configured but not active)
- **SSL proxy**: 127.0.0.1:8888
- **PAC URL**: `https://p.thenewone.lol:8443/proxy.pac`
- **Share proxy settings**: Enabled
- **Backup SSL proxy**: 127.0.0.1:8080

Note: While proxy settings are configured, type=0 means direct connection is currently active.

### 9. Media & Content

#### Media Settings
- **EME (DRM)**: Enabled for content playback
- **GMP OpenH264**: Version 2.6.0 installed
- **Widevine CDM**: Version 4.10.2934.0 installed
- **WebSpeech error notifications**: Disabled
- **Picture-in-Picture**: Used and enabled

#### PDF Handling
- **Scripting**: Disabled (security)
- **Alt text**: Enabled
- **Open attachments inline**: Enabled

### 10. Memory Management

Advanced memory optimization settings:

- **Free dirty pages**: Enabled
- **Purge threshold**: 2,048 MB
- **Tracker purging**: Active (last purge: recent)
- **Canvas memory**: Optimized
- **Content process count**: 8 (via `user.js` override)

### 11. DOM & JavaScript

- **Max script run time**: 30 seconds (increased from default)
- **Input events security**: Minimums disabled (min ticks: 0, min time: 0)
- **Report process hangs**: Disabled
- **Successive dialog time limit**: 0 (unlimited)
- **Disable open during load**: Disabled (popups allowed)
- **File create in child**: Enabled
- **Push connection**: Disabled
- **Location change rate limit**: 0

### 12. System Integration

#### Platform-Specific
- **Wayland DRM sync**: Enabled (Linux/Wayland optimization)
- **Window occlusion tracking**: Disabled (Windows-specific)

#### Profile & Install
- **Distribution**: Arch Linux
- **Profile creation time**: 1688521642 (July 2023)
- **Session count**: 51
- **Last cold startup**: Recent
- **Firefox version**: 145.0
- **Build ID**: 20251115020857

## Security Considerations

### Strengths
1. Strong tracking protection with strict mode
2. Disabled telemetry and data collection
3. Privacy-focused DNS (DoH with DNSWarden)
4. No disk cache (prevents forensic recovery)
5. Disabled speculative connections
6. Global Privacy Control enabled
7. Fingerprinting protection active
8. PDF scripting disabled

### Potential Concerns
1. **Safe Browsing completely disabled** - No protection against known phishing/malware sites
2. **OCSP disabled** - No certificate revocation checking
3. **File URI strict origin policy disabled** - Could allow local file access from web content
4. **Deprecated TLS versions enabled** - Allows connections to older, potentially vulnerable servers
5. **CSP reporting disabled** - No Content Security Policy violation reporting
6. **Update checking disabled for extensions** - Could miss security updates
7. **Large number of extensions** (40+) - Increased attack surface

### Privacy vs. Security Trade-offs
The configuration heavily favors privacy over security, particularly with Safe Browsing disabled. This means:
- ✅ No data sent to Google/Mozilla for URL checking
- ❌ No protection against known malicious sites
- ❌ Increased risk of phishing attacks

## Performance Characteristics

### Optimizations
1. **All-RAM caching** - Fast but uses significant memory (~2GB allocated)
2. **High connection limits** - Faster parallel downloads
3. **Hardware acceleration** - GPU-accelerated rendering
4. **Disabled prefetching** - Saves bandwidth but may feel slower
5. **8 content processes** - Better parallelism on multi-core CPUs

### Resource Usage
- **Expected RAM usage**: High (2-4 GB typical)
- **CPU usage**: Moderate (8 content processes)
- **Disk I/O**: Minimal (no disk cache)
- **Network**: Optimized for parallel connections

## User Experience Features

### Enabled
- Compact mode UI
- Custom CSS styling support
- Container tabs
- Profile management
- Session restore on startup
- Downloads button visible
- Picture-in-picture video
- Full-page screenshots

### Disabled
- Form autofill
- Password manager suggestions
- Search suggestions
- Trending searches
- Bookmarks toolbar
- Welcome/onboarding screens
- AI features
- Sponsored content

## Configuration Quality Assessment

### Strengths
1. Well-organized using Betterfox as base
2. Clear performance optimizations
3. Comprehensive privacy settings
4. Consistent telemetry blocking
5. Thoughtful UI customization

### Potential Issues
1. Security features disabled for privacy
2. Very high extension count (maintenance burden)
3. Some dummy URLs could break functionality
4. High memory requirements
5. No automatic updates for extensions

## Recommendations

### For Security-Conscious Users
Consider enabling:
- Safe Browsing (at least for phishing)
- OCSP certificate checking
- Extension auto-updates
- CSP reporting for debugging

### For Performance
The configuration is already well-optimized for performance. Monitor:
- Memory usage (high cache values)
- Extension overhead (40+ active)
- Content process count (8 processes)

### For Privacy
Configuration is excellent for privacy. Already implements:
- DoH with privacy-focused provider
- Tracking protection (strict)
- No telemetry
- GPC enabled
- Fingerprinting protection

## Summary

This Firefox configuration represents a **privacy-first, performance-optimized setup** based on the well-regarded Betterfox project. It trades some security features (Safe Browsing, OCSP) for enhanced privacy and uses aggressive memory caching for better performance. The setup is suitable for:

- Privacy-conscious users willing to accept security trade-offs
- Users with adequate RAM (8GB+ recommended)
- Users who understand the risks of disabled Safe Browsing
- Power users comfortable with manual extension management

**Not recommended for**:
- Casual users who need Safe Browsing protection
- Systems with limited RAM (<4GB)
- Users who want automatic security updates
- Users who frequently visit unknown websites

## Files Analyzed

1. **firefox/prefs.js** (567 lines) - Runtime Firefox preferences
2. **firefox/user.js** (246 lines) - User-defined Betterfox configuration v144

Analysis completed: 2025-12-07
