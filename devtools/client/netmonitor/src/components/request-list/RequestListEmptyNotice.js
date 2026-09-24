/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const Actions = require("resource://devtools/client/netmonitor/src/actions/index.js");
const {
  ACTIVITY_TYPE,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const {
  getPerformanceAnalysisURL,
} = require("resource://devtools/client/netmonitor/src/utils/doc-utils.js");

// Components
const MDNLink = createFactory(
  require("resource://devtools/client/shared/components/MdnLink.js")
);

const { button, div, span } = dom;

/**
 * UI displayed when the request list is empty. Contains instructions on reloading
 * the page and on triggering performance analysis of the page.
 */
class RequestListEmptyNotice extends Component {
  static get propTypes() {
    return {
      connector: PropTypes.object.isRequired,
      getString: PropTypes.func.isRequired,
      onReloadClick: PropTypes.func.isRequired,
      onPerfClick: PropTypes.func.isRequired,
    };
  }

  render() {
    const { connector, getString } = this.props;
    const toolbox = connector.getToolbox();

    return div(
      {
        className: "request-list-empty-notice",
      },
      !toolbox.isBrowserToolbox &&
        !toolbox.commands.descriptorFront.isWebExtensionDescriptor
        ? div(
            { className: "notice-reload-message empty-notice-element" },
            Localized({ id: "netmonitor-reload-notice-1" }, span(null)),
            Localized(
              { id: "netmonitor-reload-notice-2" },
              button({
                className:
                  "devtools-button devtools-button-standalone requests-list-reload-notice-button",
                onClick: this.props.onReloadClick,
              })
            ),
            Localized({ id: "netmonitor-reload-notice-3" }, span(null))
          )
        : div(
            { className: "notice-reload-message empty-notice-element" },
            Localized({ id: "netmonitor-empty-browser-toolbox" }, span(null))
          ),
      !toolbox.isBrowserToolbox &&
        !toolbox.commands.descriptorFront.isWebExtensionDescriptor
        ? div(
            { className: "notice-perf-message empty-notice-element" },
            Localized({ id: "netmonitor-perf-notice-1" }, span(null)),
            Localized(
              { id: "netmonitor-perf-notice-3", attrs: { title: true } },
              button({
                className:
                  "devtools-button devtools-button-standalone requests-list-perf-notice-button",
                onClick: this.props.onPerfClick,
              })
            ),
            Localized({ id: "netmonitor-perf-notice-2" }, span(null)),
            MDNLink({
              url: getPerformanceAnalysisURL(),
              title: getString("charts-learn-more"),
            })
          )
        : null
    );
  }
}

module.exports = FluentReact.withLocalization(
  connect(undefined, (dispatch, props) => ({
    onPerfClick: () => dispatch(Actions.openStatistics(props.connector, true)),
    onReloadClick: () =>
      props.connector.triggerActivity(ACTIVITY_TYPE.RELOAD.WITH_CACHE_DEFAULT),
  }))(RequestListEmptyNotice)
);
