/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const {
  fetchNetworkUpdatePacket,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);

// Components
const TreeViewClass = ChromeUtils.importESModule(
  "resource://devtools/client/shared/components/tree/TreeView.mjs"
).default;
const PropertiesView = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/PropertiesView.js")
);

const { div, input } = dom;

/**
 * Cache panel component
 * This tab lists full details of any cache information of the response.
 */
class CachePanel extends Component {
  static get propTypes() {
    return {
      connector: PropTypes.object.isRequired,
      openLink: PropTypes.func,
      request: PropTypes.object.isRequired,
      getString: PropTypes.func.isRequired,
    };
  }

  componentDidMount() {
    const { connector, request } = this.props;
    fetchNetworkUpdatePacket(connector.requestData, request, ["responseCache"]);
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { connector, request } = nextProps;
    fetchNetworkUpdatePacket(connector.requestData, request, ["responseCache"]);
  }

  renderSummary(label, value) {
    return div(
      { className: "tabpanel-summary-container cache-summary" },
      div(
        {
          className: "tabpanel-summary-label cache-summary-label",
        },
        label + ":"
      ),
      input({
        className: "tabpanel-summary-value textbox-input devtools-monospace",
        readOnly: true,
        value,
      })
    );
  }

  getProperties(responseCache) {
    let responseCacheObj;
    let cacheObj;
    try {
      responseCacheObj = Object.assign({}, responseCache);
      responseCacheObj = responseCacheObj.cache;
    } catch (e) {
      return null;
    }
    try {
      cacheObj = Object.assign({}, responseCacheObj);
    } catch (e) {
      return null;
    }
    return cacheObj;
  }

  getDate(timestamp) {
    if (!timestamp) {
      return null;
    }
    const d = new Date(parseInt(timestamp, 10) * 1000);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }

  render() {
    const { request, getString } = this.props;
    const { responseCache } = request;

    let object;
    const cache = this.getProperties(responseCache);
    const notAvailable = getString("netmonitor-cache-not-available");

    if (
      cache.lastFetched ||
      cache.fetchCount ||
      cache.storageDataSize ||
      cache.lastModified ||
      cache.expirationTime ||
      cache.deviceID
    ) {
      object = {
        [getString("netmonitor-cache-cache")]: {
          [getString("netmonitor-cache-last-fetched")]:
            this.getDate(cache.lastFetched) || notAvailable,
          [getString("netmonitor-cache-fetch-count")]:
            cache.fetchCount || notAvailable,
          [getString("netmonitor-cache-data-size")]:
            cache.storageDataSize || notAvailable,
          [getString("netmonitor-cache-last-modified")]:
            this.getDate(cache.lastModified) || notAvailable,
          [getString("netmonitor-cache-expires")]:
            this.getDate(cache.expirationTime) || notAvailable,
          [getString("netmonitor-cache-device")]:
            cache.deviceID || notAvailable,
        },
      };
    } else {
      return Localized(
        { id: "netmonitor-cache-empty" },
        div({ className: "empty-notice" })
      );
    }

    return div(
      { className: "panel-container security-panel" },
      PropertiesView({
        object,
        enableFilter: false,
        expandedNodes: TreeViewClass.getExpandedNodes(object),
      })
    );
  }
}

module.exports = FluentReact.withLocalization(CachePanel);
