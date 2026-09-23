/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const Actions = require("resource://devtools/client/netmonitor/src/actions/index.js");
const {
  CHANNEL_TYPE,
  FILTER_SEARCH_DELAY,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);
const { button, span, div } = dom;

// Components
const MessageFilterMenu = createFactory(
  require("resource://devtools/client/netmonitor/src/components/messages/MessageFilterMenu.js")
);
const SearchBox = createFactory(
  require("resource://devtools/client/shared/components/SearchBox.js")
);

/**
 * MessagesPanel toolbar component.
 *
 * Toolbar contains a set of useful tools that clear the list of
 * existing messages as well as filter content.
 */
class Toolbar extends Component {
  static get propTypes() {
    return {
      searchboxRef: PropTypes.object.isRequired,
      toggleMessageFilterType: PropTypes.func.isRequired,
      toggleControlFrames: PropTypes.func.isRequired,
      clearMessages: PropTypes.func.isRequired,
      setMessageFilterText: PropTypes.func.isRequired,
      messageFilterType: PropTypes.string.isRequired,
      showControlFrames: PropTypes.bool.isRequired,
      channelType: PropTypes.string,
      getString: PropTypes.func.isRequired,
    };
  }

  componentWillUnmount() {
    const { setMessageFilterText } = this.props;
    setMessageFilterText("");
  }

  /**
   * Render a separator.
   */
  renderSeparator() {
    return span({ className: "devtools-separator" });
  }

  /**
   * Render a clear button.
   */
  renderClearButton(clearMessages) {
    return Localized(
      {
        id: "netmonitor-ws-toolbar-clear",
        attrs: { title: true },
      },
      button({
        className:
          "devtools-button devtools-clear-icon message-list-clear-button",
        onClick: () => {
          clearMessages();
        },
      })
    );
  }

  /**
   * Render the message filter menu button.
   */
  renderMessageFilterMenu() {
    const {
      messageFilterType,
      toggleMessageFilterType,
      showControlFrames,
      toggleControlFrames,
    } = this.props;

    return MessageFilterMenu({
      messageFilterType,
      toggleMessageFilterType,
      showControlFrames,
      toggleControlFrames,
    });
  }

  /**
   * Render filter Searchbox.
   */
  renderFilterBox(setMessageFilterText) {
    const { getString } = this.props;

    return SearchBox({
      delay: FILTER_SEARCH_DELAY,
      keyShortcut: getString("netmonitor-ws-toolbar-filter-freetext-key"),
      placeholder: getString("netmonitor-ws-toolbar-filter-freetext-label"),
      type: "filter",
      ref: this.props.searchboxRef,
      onChange: setMessageFilterText,
    });
  }

  render() {
    const { clearMessages, setMessageFilterText, channelType } = this.props;
    const isWs = channelType === CHANNEL_TYPE.WEB_SOCKET;
    return div(
      {
        id: "netmonitor-toolbar-container",
        className: "devtools-toolbar devtools-input-toolbar",
      },
      this.renderClearButton(clearMessages),
      isWs ? this.renderSeparator() : null,
      isWs ? this.renderMessageFilterMenu() : null,
      this.renderSeparator(),
      this.renderFilterBox(setMessageFilterText)
    );
  }
}

module.exports = FluentReact.withLocalization(
  connect(
    state => ({
      messageFilterType: state.messages.messageFilterType,
      showControlFrames: state.messages.showControlFrames,
      channelType: state.messages.currentChannelType,
    }),
    dispatch => ({
      clearMessages: () => dispatch(Actions.clearMessages()),
      toggleMessageFilterType: filter =>
        dispatch(Actions.toggleMessageFilterType(filter)),
      toggleControlFrames: () => dispatch(Actions.toggleControlFrames()),
      setMessageFilterText: text =>
        dispatch(Actions.setMessageFilterText(text)),
    })
  )(Toolbar)
);
