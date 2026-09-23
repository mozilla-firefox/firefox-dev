/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const { LocalizationHelper } = require("resource://devtools/shared/l10n.js");
loader.lazyRequireGetter(
  this,
  "BLOCKED_REASON_MESSAGES",
  "resource://devtools/client/netmonitor/src/constants.js",
  true
);

const NET_STRINGS_URI = "devtools/client/locales/netmonitor.properties";

exports.L10N = new LocalizationHelper(NET_STRINGS_URI);

loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

/**
 * Read the attributes of a menu item's message.
 *
 * @param string id
 *        Fluent id of a message carrying a .label attribute, and a .accesskey
 *        attribute where the item has an access key.
 * @param object args [optional]
 *        Variables referenced by the message.
 * @return object
 *         The attributes keyed by name, ready to be spread into a menu item.
 */
function getMenuItemStrings(id, args) {
  const [message] = l10n.formatMessagesSync([{ id, args }]);
  return Object.fromEntries(
    message.attributes.map(({ name, value }) => [name, value])
  );
}

function getBlockedReasonString(blockedReason, extension) {
  if (!blockedReason) {
    return null;
  }

  if (extension?.blocking) {
    return exports.L10N.getFormatStr(
      "networkMenu.blockedby",
      extension.blocking
    );
  }

  if (extension?.blocked) {
    return exports.L10N.getFormatStr(
      "networkMenu.addonBlocked",
      extension.blocked
    );
  }

  // If we receive a platform error code, print it as-is
  if (typeof blockedReason == "string" && blockedReason.startsWith("NS_")) {
    return blockedReason;
  }

  return (
    BLOCKED_REASON_MESSAGES[blockedReason] ||
    exports.L10N.getStr("networkMenu.blocked2")
  );
}

exports.getBlockedReasonString = getBlockedReasonString;
exports.getMenuItemStrings = getMenuItemStrings;
