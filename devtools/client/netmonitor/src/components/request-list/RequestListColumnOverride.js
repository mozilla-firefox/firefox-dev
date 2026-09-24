/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createElement,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const {
  getOverriddenUrl,
} = require("resource://devtools/client/netmonitor/src/selectors/index.js");

// one instance of this column is rendered per request, so the strings are read
// directly instead of subscribing every row to the localization context
loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

class RequestListColumnOverrideContent extends Component {
  static get propTypes() {
    return {
      isOverridden: PropTypes.bool.isRequired,
      item: PropTypes.object.isRequired,
      overriddenUrl: PropTypes.string,
    };
  }

  render() {
    const { isOverridden, overriddenUrl } = this.props;

    return dom.td({
      className:
        "requests-list-column requests-list-override" +
        (isOverridden ? " request-override-enabled" : ""),
      title: isOverridden
        ? l10n.formatValueSync("netmonitor-override-enabled", {
            path: overriddenUrl,
          })
        : l10n.formatValueSync("netmonitor-override-disabled"),
    });
  }
}

const RequestListColumnOverrideInner = connect(
  (state, props) => {
    const overriddenUrl = getOverriddenUrl(state, props.item.urlDetails?.url);
    return {
      isOverridden: !!overriddenUrl,
      overriddenUrl,
    };
  },
  {},
  undefined,
  { storeKey: "toolbox-store" }
)(RequestListColumnOverrideContent);

class RequestListColumnOverride extends Component {
  static get propTypes() {
    return {
      item: PropTypes.object.isRequired,
    };
  }

  render() {
    return createElement(RequestListColumnOverrideInner, {
      item: this.props.item,
    });
  }
}

module.exports = RequestListColumnOverride;
