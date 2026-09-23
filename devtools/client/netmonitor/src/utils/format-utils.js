/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

// Constants for formatting bytes.
const BYTES_IN_KB = 1000;
const BYTES_IN_MB = Math.pow(BYTES_IN_KB, 2);
const BYTES_IN_GB = Math.pow(BYTES_IN_KB, 3);
const MAX_BYTES_SIZE = 1000;
const MAX_KB_SIZE = 1000 * BYTES_IN_KB;
const MAX_MB_SIZE = 1000 * BYTES_IN_MB;

// Constants for formatting time.
const MAX_MILLISECOND = 1000;
const MAX_SECOND = 60 * MAX_MILLISECOND;

const REQUEST_DECIMALS = 2;

// Constants for formatting the priority, derived from nsISupportsPriority.idl
const PRIORITY_HIGH = -10;
const PRIORITY_NORMAL = 0;
const PRIORITY_LOW = 10;

// the caller picks how precise a size should be, which a Fluent NUMBER()
// option cannot express, so the rounding happens here and the message only
// caps what it prints
function roundToDecimals(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Get a human-readable string from a number of bytes, with the B, kB, MB, or
 * GB value.
 */
function getFormattedSize(bytes, decimals = REQUEST_DECIMALS) {
  // callers pass sizes that are not known yet, and Fluent throws on anything
  // that is not a finite number
  if (!Number.isFinite(bytes)) {
    bytes = 0;
  }
  if (bytes < MAX_BYTES_SIZE) {
    return l10n.formatValueSync("network-menu-size-b", { size: bytes });
  }
  if (bytes < MAX_KB_SIZE) {
    return l10n.formatValueSync("network-menu-size-kb", {
      size: roundToDecimals(bytes / BYTES_IN_KB, decimals),
    });
  }
  if (bytes < MAX_MB_SIZE) {
    return l10n.formatValueSync("network-menu-size-mb", {
      size: roundToDecimals(bytes / BYTES_IN_MB, decimals),
    });
  }
  return l10n.formatValueSync("network-menu-size-gb", {
    size: roundToDecimals(bytes / BYTES_IN_GB, decimals),
  });
}

/**
 * Get a human-readable string from a number of time, with the ms, s, or min
 * value.
 */
function getFormattedTime(ms) {
  if (!Number.isFinite(ms)) {
    ms = 0;
  }
  if (ms < MAX_MILLISECOND) {
    return l10n.formatValueSync("network-menu-millisecond", { time: ms | 0 });
  }
  if (ms < MAX_SECOND) {
    return l10n.formatValueSync("network-menu-second", {
      time: ms / MAX_MILLISECOND,
    });
  }
  return l10n.formatValueSync("network-menu-minute", {
    time: ms / MAX_SECOND,
  });
}

/**
 * Formats IP (v4 and v6) and port
 *
 * @param {string} ip - IP address
 * @param {string} port
 * @return {string} the formatted IP + port
 */
function getFormattedIPAndPort(ip, port) {
  if (!port) {
    return ip;
  }
  return ip.match(/:+/) ? `[${ip}]:${port}` : `${ip}:${port}`;
}

/**
 * Formats the priority of a request
 * Based on unix conventions
 * See xpcom/threads/nsISupportsPriority.idl
 *
 * @param {number} priority - request priority
 */
function getRequestPriorityAsText(priority) {
  if (priority < PRIORITY_HIGH) {
    return "Highest";
  } else if (priority >= PRIORITY_HIGH && priority < PRIORITY_NORMAL) {
    return "High";
  } else if (priority === PRIORITY_NORMAL) {
    return "Normal";
  } else if (priority > PRIORITY_NORMAL && priority <= PRIORITY_LOW) {
    return "Low";
  }
  return "Lowest";
}

/**
 * Converts the English textual value of the priority of a request
 * into a number. For HAR file importing.
 * Based on unix conventions
 * See xpcom/threads/nsISupportsPriority.idl for values
 *
 * @param {string} priority - request priority
 */
function getRequestPriorityAsNumber(priority) {
  switch (priority) {
    case "Highest":
      return Ci.nsISupportsPriority.PRIORITY_HIGHEST;
    case "VeryHigh": // Chromium based HAR tooling equivalent
      return Ci.nsISupportsPriority.PRIORITY_HIGHEST;
    case "High":
      return Ci.nsISupportsPriority.PRIORITY_HIGH;
    case "Normal":
      return Ci.nsISupportsPriority.PRIORITY_NORMAL;
    case "Medium": // Chromium based HAR tooling equivalent
      return Ci.nsISupportsPriority.PRIORITY_NORMAL;
    case "Low":
      return Ci.nsISupportsPriority.PRIORITY_LOW;
    case "Lowest":
      return Ci.nsISupportsPriority.PRIORITY_LOWEST;
    case "VeryLow": // Chromium based HAR tooling equivalent
      return Ci.nsISupportsPriority.PRIORITY_LOWEST;
    default:
      return null;
  }
}

module.exports = {
  getFormattedIPAndPort,
  getFormattedSize,
  getFormattedTime,
  getRequestPriorityAsText,
  getRequestPriorityAsNumber,
};
