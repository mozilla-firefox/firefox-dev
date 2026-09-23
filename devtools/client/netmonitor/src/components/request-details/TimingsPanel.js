/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const {
  getNetMonitorTimingsURL,
} = require("resource://devtools/client/netmonitor/src/utils/doc-utils.js");
const {
  fetchNetworkUpdatePacket,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");
const {
  getFormattedTime,
} = require("resource://devtools/client/netmonitor/src/utils/format-utils.js");
const {
  TIMING_KEYS,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);

// Components
const MDNLink = require("resource://devtools/client/shared/components/MdnLink.js");

const { div, span } = dom;

const TIMINGS_L10N_IDS = {
  blocked: "netmonitor-timings-blocked",
  dns: "netmonitor-timings-dns",
  connect: "netmonitor-timings-connect",
  ssl: "netmonitor-timings-ssl",
  send: "netmonitor-timings-send",
  wait: "netmonitor-timings-wait",
  receive: "netmonitor-timings-receive",
  launchServiceWorker: "netmonitor-timings-launch-service-worker",
  requestToServiceWorker: "netmonitor-timings-request-to-service-worker",
  handledByServiceWorker: "netmonitor-timings-handled-by-service-worker",
};

/**
 * Timings panel component
 * Display timeline bars that shows the total wait time for various stages
 */
class TimingsPanel extends Component {
  static get propTypes() {
    return {
      connector: PropTypes.object.isRequired,
      request: PropTypes.object.isRequired,
      firstRequestStartedMs: PropTypes.number,
    };
  }

  componentDidMount() {
    const { connector, request } = this.props;
    fetchNetworkUpdatePacket(connector.requestData, request, ["eventTimings"]);
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { connector, request } = nextProps;
    fetchNetworkUpdatePacket(connector.requestData, request, ["eventTimings"]);
  }

  renderServiceWorkerTimings() {
    const { serviceWorkerTimings } = this.props.request.eventTimings;

    if (!serviceWorkerTimings) {
      return null;
    }

    const totalTime = Object.values(serviceWorkerTimings).reduce(
      (acc, value) => acc + value,
      0
    );

    let offset = 0;
    let preValue = 0;

    return div(
      {},
      Localized(
        { id: "netmonitor-timings-service-worker-timing" },
        div({ className: "label-separator" })
      ),
      Object.entries(serviceWorkerTimings).map(([key, value]) => {
        if (preValue > 0) {
          offset += preValue / totalTime;
        }
        preValue = value;
        return div(
          {
            key,
            className:
              "tabpanel-summary-container timings-container service-worker",
          },
          Localized(
            { id: TIMINGS_L10N_IDS[key] },
            span({ className: "tabpanel-summary-label timings-label" })
          ),
          div(
            { className: "requests-list-timings-container" },
            span({
              className: `requests-list-timings-box serviceworker-timings-color-${key.replace(
                "ServiceWorker",
                ""
              )}`,
              style: {
                "--current-timing-offset": offset > 0 ? offset : 0,
                "--current-timing-width": value / totalTime,
              },
            }),
            span(
              { className: "requests-list-timings-total" },
              getFormattedTime(value)
            )
          )
        );
      })
    );
  }

  renderServerTimings() {
    const { serverTimings, totalTime } = this.props.request.eventTimings;

    if (!serverTimings?.length) {
      return null;
    }

    return div(
      {},
      Localized(
        { id: "netmonitor-timings-server-timing" },
        div({ className: "label-separator" })
      ),
      ...serverTimings.map(({ name, duration, description }, index) => {
        const color = name === "total" ? "total" : (index % 3) + 1;

        return div(
          {
            key: index,
            className: "tabpanel-summary-container timings-container server",
          },
          span(
            { className: "tabpanel-summary-label timings-label" },
            description || name
          ),
          div(
            { className: "requests-list-timings-container" },
            span({
              className: `requests-list-timings-box server-timings-color-${color}`,
              style: {
                "--current-timing-offset": (totalTime - duration) / totalTime,
                "--current-timing-width": duration / totalTime,
              },
            }),
            span(
              { className: "requests-list-timings-total" },
              getFormattedTime(duration)
            )
          )
        );
      })
    );
  }

  render() {
    const { eventTimings, totalTime, startedMs } = this.props.request;
    const { firstRequestStartedMs } = this.props;

    if (!eventTimings) {
      return Localized(
        { id: "netmonitor-timings-no-timings" },
        div({
          className:
            "tabpanel-summary-container timings-container empty-notice",
        })
      );
    }

    const { timings, offsets } = eventTimings;
    let queuedAt, startedAt, downloadedAt;
    const isFirstRequestStartedAvailable = firstRequestStartedMs !== null;

    if (isFirstRequestStartedAvailable) {
      queuedAt = startedMs - firstRequestStartedMs;
      startedAt = queuedAt + timings.blocked;
      downloadedAt = queuedAt + totalTime;
    }

    const timelines = TIMING_KEYS.map((type, idx) => {
      // Determine the relative offset for each timings box. For example, the
      // offset of third timings box will be 0 + blocked offset + dns offset
      // If offsets sent from the backend aren't available calculate it
      // from the timing info.
      const offset = offsets
        ? offsets[type]
        : TIMING_KEYS.slice(0, idx).reduce(
            (acc, cur) => acc + timings[cur] || 0,
            0
          );

      const offsetScale = offset / totalTime || 0;
      const timelineScale = timings[type] / totalTime || 0;

      return div(
        {
          key: type,
          id: `timings-summary-${type}`,
          className: "tabpanel-summary-container timings-container request",
        },
        Localized(
          { id: TIMINGS_L10N_IDS[type] },
          span({ className: "tabpanel-summary-label timings-label" })
        ),
        div(
          { className: "requests-list-timings-container" },
          span({
            className: `requests-list-timings-box ${type}`,
            style: {
              "--current-timing-offset": offsetScale,
              "--current-timing-width": timelineScale,
            },
          }),
          span(
            { className: "requests-list-timings-total" },
            getFormattedTime(timings[type])
          )
        )
      );
    });

    return div(
      { className: "panel-container" },
      isFirstRequestStartedAvailable &&
        div(
          { className: "timings-overview" },
          Localized(
            {
              id: "netmonitor-timings-queued-at",
              $time: getFormattedTime(queuedAt),
            },
            span({ className: "timings-overview-item" })
          ),
          Localized(
            {
              id: "netmonitor-timings-started-at",
              $time: getFormattedTime(startedAt),
            },
            span({ className: "timings-overview-item" })
          ),
          Localized(
            {
              id: "netmonitor-timings-downloaded-at",
              $time: getFormattedTime(downloadedAt),
            },
            span({ className: "timings-overview-item" })
          )
        ),
      Localized(
        { id: "netmonitor-timings-request-timing" },
        div({ className: "label-separator" })
      ),
      timelines,
      this.renderServiceWorkerTimings(),
      this.renderServerTimings(),
      Localized(
        {
          id: "netmonitor-timings-learn-more",
          attrs: { title: true },
        },
        MDNLink({ url: getNetMonitorTimingsURL() })
      )
    );
  }
}

module.exports = connect(state => ({
  firstRequestStartedMs: state.requests ? state.requests.firstStartedMs : null,
}))(TimingsPanel);
