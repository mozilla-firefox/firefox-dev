/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";
const {
  PureComponent,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");

const {
  getMenuItemStrings,
} = require("resource://devtools/client/netmonitor/src/utils/l10n.js");

const FILTER_TYPE_L10N_IDS = {
  all: "netmonitor-ws-context-all",
  sent: "netmonitor-ws-context-sent",
  received: "netmonitor-ws-context-received",
};

// Menu
loader.lazyRequireGetter(
  this,
  "showMenu",
  "resource://devtools/client/shared/components/menu/utils.js",
  true
);

class MessageFilterMenu extends PureComponent {
  static get propTypes() {
    return {
      messageFilterType: PropTypes.string.isRequired,
      toggleMessageFilterType: PropTypes.func.isRequired,
      // showControlFrames decides if control frames
      // will be shown in messages panel
      showControlFrames: PropTypes.bool.isRequired,
      // toggleControlFrames toggles the value for showControlFrames
      toggleControlFrames: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.onShowFilterMenu = this.onShowFilterMenu.bind(this);
  }

  onShowFilterMenu(event) {
    const {
      messageFilterType,
      toggleMessageFilterType,
      showControlFrames,
      toggleControlFrames,
    } = this.props;

    const menuItems = [
      {
        id: "message-list-context-filter-all",
        ...getMenuItemStrings("netmonitor-ws-context-all"),
        type: "checkbox",
        checked: messageFilterType === "all",
        click: () => {
          toggleMessageFilterType("all");
        },
      },
      {
        id: "message-list-context-filter-sent",
        ...getMenuItemStrings("netmonitor-ws-context-sent"),
        type: "checkbox",
        checked: messageFilterType === "sent",
        click: () => {
          toggleMessageFilterType("sent");
        },
      },
      {
        id: "message-list-context-filter-received",
        ...getMenuItemStrings("netmonitor-ws-context-received"),
        type: "checkbox",
        checked: messageFilterType === "received",
        click: () => {
          toggleMessageFilterType("received");
        },
      },
      {
        type: "separator",
      },
      {
        id: "message-list-context-filter-controlFrames",
        ...getMenuItemStrings("netmonitor-ws-context-control-frames"),
        type: "checkbox",
        checked: showControlFrames,
        click: () => {
          toggleControlFrames();
        },
      },
    ];

    showMenu(menuItems, { button: event.target });
  }

  render() {
    const { messageFilterType, showControlFrames } = this.props;
    const messageFilterTypeTitle = getMenuItemStrings(
      FILTER_TYPE_L10N_IDS[messageFilterType]
    ).label;
    const title =
      messageFilterTypeTitle +
      (showControlFrames
        ? " (" +
          getMenuItemStrings("netmonitor-ws-context-control-frames").label +
          ")"
        : "");

    return dom.button(
      {
        id: "frame-filter-menu",
        className: "devtools-button devtools-dropdown-button",
        title,
        onClick: this.onShowFilterMenu,
      },
      dom.span({ className: "title" }, title)
    );
  }
}

module.exports = MessageFilterMenu;
