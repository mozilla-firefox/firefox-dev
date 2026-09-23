/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const {
  MESSAGE_HEADERS,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const Actions = require("resource://devtools/client/netmonitor/src/actions/index.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");

// Components
const MessageListHeaderContextMenu = require("resource://devtools/client/netmonitor/src/components/messages/MessageListHeaderContextMenu.js");

/**
 * Renders the message list header.
 */
class MessageListHeader extends Component {
  static get propTypes() {
    return {
      columns: PropTypes.object.isRequired,
      toggleColumn: PropTypes.func.isRequired,
      resetColumns: PropTypes.func.isRequired,
      getString: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.onContextMenu = this.onContextMenu.bind(this);
  }

  onContextMenu(evt) {
    evt.preventDefault();
    const { resetColumns, toggleColumn, columns } = this.props;

    if (!this.contextMenu) {
      this.contextMenu = new MessageListHeaderContextMenu({
        toggleColumn,
        resetColumns,
      });
    }
    this.contextMenu.open(evt, columns);
  }

  /**
   * Helper method to get visibleColumns.
   */
  getVisibleColumns() {
    const { columns } = this.props;
    return MESSAGE_HEADERS.filter(header => columns[header.name]);
  }

  /**
   * Render one column header from the table headers.
   */
  renderColumn({ name, l10nId, width = "10%" }) {
    const label = this.props.getString(l10nId);

    return dom.th(
      {
        key: name,
        id: `message-list-${name}-header-box`,
        className: `message-list-column message-list-${name}`,
        scope: "col",
        style: { width },
      },
      dom.button(
        {
          id: `message-list-${name}-button`,
          className: `message-list-header-button`,
          title: label,
        },
        dom.div({ className: "button-text" }, label),
        dom.div({ className: "button-icon" })
      )
    );
  }

  /**
   * Render all columns in the table header.
   */
  renderColumns() {
    const visibleColumns = this.getVisibleColumns();
    return visibleColumns.map(header => this.renderColumn(header));
  }

  render() {
    return dom.thead(
      { className: "message-list-headers-group" },
      dom.tr(
        {
          className: "message-list-headers",
          onContextMenu: this.onContextMenu,
        },
        this.renderColumns()
      )
    );
  }
}

module.exports = FluentReact.withLocalization(
  connect(
    state => ({
      columns: state.messages.columns,
    }),
    dispatch => ({
      toggleColumn: column => dispatch(Actions.toggleMessageColumn(column)),
      resetColumns: () => dispatch(Actions.resetMessageColumns()),
    })
  )(MessageListHeader)
);
