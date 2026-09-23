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
  getAbbreviatedMimeType,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");

// one instance of this column is rendered per request, so the string is read
// directly instead of subscribing every row to the localization context
loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

class RequestListColumnType extends Component {
  static get propTypes() {
    return {
      item: PropTypes.object.isRequired,
    };
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.item.mimeType !== nextProps.item.mimeType ||
      this.props.item.isRedirect !== nextProps.item.isRedirect
    );
  }

  render() {
    const { mimeType, isRedirect } = this.props.item;
    let abbrevType;

    if (mimeType) {
      abbrevType = getAbbreviatedMimeType(mimeType);
    }

    return dom.td(
      {
        className: "requests-list-column requests-list-type",
        title: mimeType,
      },
      isRedirect
        ? l10n.formatValueSync("network-menu-redirect", {
            // a redirect often has no content type, and Fluent raises on a
            // missing variable rather than interpolating nothing
            type: abbrevType ?? "",
          })
        : abbrevType
    );
  }
}

module.exports = RequestListColumnType;
