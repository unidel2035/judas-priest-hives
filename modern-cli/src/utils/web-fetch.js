/**
 * Web Fetch Tool - Retrieve content from URLs
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import chalk from 'chalk';

/**
 * Fetch content from a URL
 */
export async function fetchUrl(urlString, options = {}) {
  try {
    const url = new URL(urlString);
    const protocol = url.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const requestOptions = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'Hives-CLI/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          ...options.headers,
        },
        timeout: options.timeout || 10000,
      };

      const req = protocol.request(requestOptions, (res) => {
        let data = '';

        // Handle redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, urlString);
          resolve(fetchUrl(redirectUrl.toString(), options));
          return;
        }

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              body: data,
              url: urlString,
            });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(options.body);
      }

      req.end();
    });
  } catch (error) {
    throw new Error(`Invalid URL: ${error.message}`);
  }
}

/**
 * Fetch and format content for display
 */
export async function fetchAndDisplay(url) {
  console.log(chalk.cyan(`\n🌐 Fetching: ${url}\n`));

  try {
    const response = await fetchUrl(url);
    console.log(chalk.green(`✓ Status: ${response.statusCode}`));
    console.log(chalk.gray(`  Content-Type: ${response.headers['content-type'] || 'unknown'}`));
    console.log(chalk.gray(`  Content-Length: ${response.body.length} bytes\n`));

    // Display content preview (first 500 characters)
    const preview = response.body.slice(0, 500);
    console.log(chalk.cyan('Content Preview:'));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(preview);
    if (response.body.length > 500) {
      console.log(chalk.dim('\n... (truncated)'));
    }
    console.log(chalk.gray('─'.repeat(60) + '\n'));

    return response.body;
  } catch (error) {
    console.error(chalk.red(`\n✗ Fetch failed: ${error.message}\n`));
    return null;
  }
}

/**
 * Convert HTML to plain text (basic)
 */
export function htmlToText(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
