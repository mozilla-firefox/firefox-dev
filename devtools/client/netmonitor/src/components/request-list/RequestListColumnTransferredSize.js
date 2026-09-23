/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const {
  getFormattedSize,
} = require("resource://devtools/client/netmonitor/src/utils/format-utils.js");
const {
  getBlockedReasonString,
} = require("resource://devtools/client/netmonitor/src/utils/l10n.js");
const {
  propertiesEqual,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");

// one instance of this column is rendered per request, so the strings are read
// directly instead of subscribing every row to the localization context
loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

loader.lazyGetter(this, "SIZE_CACHED", () =>
  l10n.formatValueSync("network-menu-size-cached")
);
loader.lazyGetter(this, "SIZE_SERVICE_WORKER", () =>
  l10n.formatValueSync("network-menu-size-service-worker")
);
loader.lazyGetter(this, "SIZE_UNAVAILABLE", () =>
  l10n.formatValueSync("network-menu-size-unavailable")
);
loader.lazyGetter(this, "SIZE_UNAVAILABLE_TITLE", () =>
  l10n.formatValueSync("network-menu-size-unavailable-title")
);
const UPDATED_TRANSFERRED_PROPS = [
  "transferredSize",
  "fromCache",
  "fromServiceWorker",
  "blockedReason",
  "extension",
];

class RequestListColumnTransferredSize extends Component {
  static get propTypes() {
    return {
      item: PropTypes.object.isRequired,
    };
  }

  shouldComponentUpdate(nextProps) {
    return !propertiesEqual(
      UPDATED_TRANSFERRED_PROPS,
      this.props.item,
      nextProps.item
    );
  }

  render() {
    const {
      blockedReason,
      extension,
      fromCache,
      fromServiceWorker,
      status,
      transferredSize,
    } = this.props.item;
    let text;

    if (blockedReason) {
      text = getBlockedReasonString(blockedReason, extension);
    } else if (fromCache || status === "304") {
      text = SIZE_CACHED;
    } else if (fromServiceWorker) {
      text = SIZE_SERVICE_WORKER;
    } else if (typeof transferredSize == "number") {
      text = getFormattedSize(transferredSize);
    } else if (transferredSize === null) {
      text = SIZE_UNAVAILABLE;
    }

    const title = text == SIZE_UNAVAILABLE ? SIZE_UNAVAILABLE_TITLE : text;

    return dom.td(
      {
        className:
          "requests-list-column requests-list-number-column requests-list-transferred",
        title,
      },
      text
    );
  }
}

module.exports = RequestListColumnTransferredSize;
