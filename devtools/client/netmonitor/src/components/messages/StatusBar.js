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
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const {
  getDisplayedMessagesSummary,
} = require("resource://devtools/client/netmonitor/src/selectors/index.js");
const {
  getFormattedSize,
  getFormattedTime,
} = require("resource://devtools/client/netmonitor/src/utils/format-utils.js");
const {
  propertiesEqual,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");

const {
  CHANNEL_TYPE,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);

const { div, footer } = dom;

const UPDATED_MSG_SUMMARY_PROPS = ["count", "totalMs", "totalSize"];

/**
 * Displays the summary of message count, total size and total time since the first message.
 */
class StatusBar extends Component {
  static get propTypes() {
    return {
      channelType: PropTypes.string,
      summary: PropTypes.object.isRequired,
    };
  }

  shouldComponentUpdate(nextProps) {
    const { summary, channelType } = this.props;
    return (
      channelType !== nextProps.channelType ||
      !propertiesEqual(UPDATED_MSG_SUMMARY_PROPS, summary, nextProps.summary)
    );
  }

  render() {
    const { summary, channelType } = this.props;
    const { count, totalMs, sentSize, receivedSize, totalSize } = summary;

    const totalSizeText = getFormattedSize(totalSize);
    const sentSizeText = getFormattedSize(sentSize);
    const receivedText = getFormattedSize(receivedSize);
    const totalMillisText = getFormattedTime(totalMs);

    // channelType might be null in which case it's better to just show
    // total size than showing all three sizes.
    const summaryText =
      channelType === CHANNEL_TYPE.WEB_SOCKET
        ? Localized({
            id: "network-menu-ws-summary-messages-transferred-size",
            $formattedTotalSize: totalSizeText,
            $formattedSentSize: sentSizeText,
            $formattedReceivedSize: receivedText,
          })
        : `${totalSizeText} total`;

    return footer(
      { className: "devtools-toolbar devtools-toolbar-bottom" },
      Localized(
        {
          id: "network-menu-ws-summary-tooltip-messages-count",
          attrs: { title: true },
        },
        div(
          {
            className: "status-bar-label message-network-summary-count",
          },
          Localized({
            id: "network-menu-ws-summary-messages-count",
            $messageCount: count,
          })
        )
      ),
      count !== 0 &&
        Localized(
          {
            id: "network-menu-ws-summary-tooltip-messages-total-size",
            attrs: { title: true },
          },
          div(
            {
              className: "status-bar-label message-network-summary-total-size",
            },
            summaryText
          )
        ),
      count !== 0 &&
        Localized(
          {
            id: "network-menu-ws-summary-tooltip-messages-total-time",
            attrs: { title: true },
          },
          div(
            {
              className:
                "status-bar-label message-network-summary-total-millis",
            },
            totalMillisText
          )
        )
    );
  }
}

module.exports = connect(state => ({
  channelType: state.messages.currentChannelType,
  summary: getDisplayedMessagesSummary(state),
}))(StatusBar);
