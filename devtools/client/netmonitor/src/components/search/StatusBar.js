/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const {
  getSearchStatus,
  getSearchResultCount,
  getSearchResourceCount,
} = require("resource://devtools/client/netmonitor/src/selectors/index.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const { div, span } = dom;
const {
  SEARCH_STATUS,
} = require("resource://devtools/client/netmonitor/src/constants.js");

/**
 * Displays the number of lines found for results and resource count (files)
 */
class StatusBar extends Component {
  static get propTypes() {
    return {
      status: PropTypes.string,
      resultsCount: PropTypes.number,
      resourceCount: PropTypes.number,
      getString: PropTypes.func.isRequired,
    };
  }

  getSearchStatusDoneLabel(lines, files) {
    const { getString } = this.props;
    return getString("netmonitor-search-status-labels-done", {
      matchingLines: getString(
        "netmonitor-search-status-labels-matching-lines",
        { lines }
      ),
      matchingFiles: getString("netmonitor-search-status-labels-file-count", {
        files,
      }),
    });
  }

  renderStatus() {
    const { getString, status, resultsCount, resourceCount } = this.props;

    switch (status) {
      case SEARCH_STATUS.FETCHING:
        return getString("netmonitor-search-status-labels-fetching");
      case SEARCH_STATUS.DONE:
        return this.getSearchStatusDoneLabel(resultsCount, resourceCount);
      case SEARCH_STATUS.ERROR:
        return getString("netmonitor-search-status-labels-error");
      case SEARCH_STATUS.CANCELED:
        return getString("netmonitor-search-status-labels-canceled");
      default:
        return "";
    }
  }

  render() {
    const { status } = this.props;
    return div(
      { className: "devtools-toolbar devtools-toolbar-bottom" },
      div(
        {
          className: "status-bar-label",
          title: this.renderStatus(),
        },
        this.renderStatus(),
        status === SEARCH_STATUS.FETCHING
          ? span({ className: "img loader" })
          : ""
      )
    );
  }
}

module.exports = FluentReact.withLocalization(
  connect(state => ({
    status: getSearchStatus(state),
    resultsCount: getSearchResultCount(state),
    resourceCount: getSearchResourceCount(state),
  }))(StatusBar)
);
