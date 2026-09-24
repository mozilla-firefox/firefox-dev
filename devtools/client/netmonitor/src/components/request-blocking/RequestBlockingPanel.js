/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const {
  button,
  div,
  form,
  input,
  label,
  li,
  span,
  ul,
} = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const Actions = require("resource://devtools/client/netmonitor/src/actions/index.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);
const {
  PANELS,
} = require("resource://devtools/client/netmonitor/src/constants.js");

const RequestBlockingContextMenu = require("resource://devtools/client/netmonitor/src/widgets/RequestBlockingContextMenu.js");

class RequestBlockingPanel extends Component {
  static get propTypes() {
    return {
      blockedUrls: PropTypes.array.isRequired,
      addBlockedUrl: PropTypes.func.isRequired,
      isDisplaying: PropTypes.bool.isRequired,
      removeBlockedUrl: PropTypes.func.isRequired,
      toggleBlockingEnabled: PropTypes.func.isRequired,
      toggleBlockedUrl: PropTypes.func.isRequired,
      updateBlockedUrl: PropTypes.func.isRequired,
      removeAllBlockedUrls: PropTypes.func.isRequired,
      disableAllBlockedUrls: PropTypes.func.isRequired,
      enableAllBlockedUrls: PropTypes.func.isRequired,
      blockingEnabled: PropTypes.bool.isRequired,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      editingUrl: null,
    };
  }

  componentDidMount() {
    this.refs.addInput.focus();
  }

  componentDidUpdate(prevProps) {
    if (this.state.editingUrl) {
      this.refs.editInput.focus();
      this.refs.editInput.select();
    } else if (this.props.isDisplaying && !prevProps.isDisplaying) {
      this.refs.addInput.focus();
    }
  }

  componentWillUnmount() {
    if (this.scrollToBottomTimeout) {
      clearTimeout(this.scrollToBottomTimeout);
    }
  }

  scrollToBottom() {
    if (this.scrollToBottomTimeout) {
      clearTimeout(this.scrollToBottomTimeout);
    }
    this.scrollToBottomTimeout = setTimeout(() => {
      const { contents } = this.refs;
      if (contents.scrollHeight > contents.offsetHeight) {
        contents.scrollTo({ top: contents.scrollHeight });
      }
    }, 40);
  }

  renderEnableBar() {
    return div(
      { className: "request-blocking-enable-bar" },
      div(
        { className: "request-blocking-enable-form" },
        label(
          { className: "devtools-checkbox-label" },
          input({
            type: "checkbox",
            className: "devtools-checkbox",
            checked: this.props.blockingEnabled,
            ref: "enabledCheckbox",
            onChange: () =>
              this.props.toggleBlockingEnabled(
                this.refs.enabledCheckbox.checked
              ),
          }),
          Localized(
            { id: "netmonitor-actionbar-enable-blocking" },
            span({ className: "request-blocking-label" })
          )
        )
      )
    );
  }

  renderItemContent({ url, enabled }) {
    const { toggleBlockedUrl, removeBlockedUrl } = this.props;

    return li(
      { key: url },
      label(
        {
          className: "devtools-checkbox-label",
          onDoubleClick: () => this.setState({ editingUrl: url }),
        },
        input({
          type: "checkbox",
          className: "devtools-checkbox",
          checked: enabled,
          onChange: () => toggleBlockedUrl(url),
        }),
        span(
          {
            className: "request-blocking-label request-blocking-editable-label",
            title: url,
          },
          url
        )
      ),
      Localized(
        {
          id: "netmonitor-actionbar-remove-blocked-url",
          attrs: { title: true, "aria-label": true },
        },
        button({
          className: "request-blocking-remove-button",
          onClick: () => removeBlockedUrl(url),
        })
      )
    );
  }

  renderEditForm(url) {
    const { updateBlockedUrl, removeBlockedUrl } = this.props;
    return li(
      { key: url, className: "request-blocking-edit-item" },
      form(
        {
          onSubmit: e => {
            const { editInput } = this.refs;
            const newValue = editInput.value;
            e.preventDefault();

            if (url != newValue) {
              if (editInput.value.trim() === "") {
                removeBlockedUrl(url, newValue);
              } else {
                updateBlockedUrl(url, newValue);
              }
            }
            this.setState({ editingUrl: null });
          },
        },
        Localized(
          {
            id: "netmonitor-actionbar-block-search-placeholder",
            attrs: { placeholder: true },
          },
          input({
            type: "text",
            defaultValue: url,
            ref: "editInput",
            className: "devtools-searchinput",
            onBlur: () => this.setState({ editingUrl: null }),
            onKeyDown: e => {
              if (e.key === "Escape") {
                e.stopPropagation();
                e.preventDefault();
                this.setState({ editingUrl: null });
              }
            },
          })
        ),

        input({ type: "submit", style: { display: "none" } })
      )
    );
  }

  renderBlockedList() {
    const {
      blockedUrls,
      blockingEnabled,
      removeAllBlockedUrls,
      disableAllBlockedUrls,
      enableAllBlockedUrls,
    } = this.props;

    if (blockedUrls.length === 0) {
      return null;
    }

    const listItems = blockedUrls.map(item =>
      this.state.editingUrl === item.url
        ? this.renderEditForm(item.url)
        : this.renderItemContent(item)
    );

    return div(
      {
        className: "request-blocking-contents",
        ref: "contents",
        onContextMenu: event => {
          if (!this.contextMenu) {
            this.contextMenu = new RequestBlockingContextMenu({
              removeAllBlockedUrls,
              disableAllBlockedUrls,
              enableAllBlockedUrls,
            });
          }

          const contextMenuOptions = {
            disableDisableAllBlockedUrls: blockedUrls.every(
              ({ enabled }) => enabled === false
            ),
            disableEnableAllBlockedUrls: blockedUrls.every(
              ({ enabled }) => enabled === true
            ),
          };

          this.contextMenu.open(event, contextMenuOptions);
        },
      },
      ul(
        {
          className: `request-blocking-list ${
            blockingEnabled ? "" : "disabled"
          }`,
        },
        ...listItems
      )
    );
  }

  renderAddForm() {
    const { addBlockedUrl } = this.props;
    return div(
      { className: "request-blocking-footer" },
      form(
        {
          className: "request-blocking-add-form",
          onSubmit: e => {
            const { addInput } = this.refs;
            e.preventDefault();
            addBlockedUrl(addInput.value);
            addInput.value = "";
            addInput.focus();
            this.scrollToBottom();
          },
        },
        Localized(
          {
            id: "netmonitor-actionbar-block-search-placeholder",
            attrs: { placeholder: true },
          },
          input({
            type: "text",
            ref: "addInput",
            className: "devtools-searchinput",
            onKeyDown: e => {
              if (e.key === "Escape") {
                e.stopPropagation();
                e.preventDefault();

                const { addInput } = this.refs;
                addInput.value = "";
                addInput.focus();
              }
            },
          })
        ),
        input({ type: "submit", style: { display: "none" } })
      )
    );
  }

  renderEmptyListNotice() {
    return div(
      { className: "request-blocking-list-empty-notice" },
      Localized(
        { id: "netmonitor-actionbar-request-blocking-usage-notice" },
        div({ className: "request-blocking-notice-element" })
      ),
      Localized(
        { id: "netmonitor-actionbar-request-blocking-add-notice" },
        div({ className: "request-blocking-notice-element" })
      )
    );
  }

  render() {
    const { blockedUrls, addBlockedUrl } = this.props;

    return div(
      {
        className: "request-blocking-panel",
        onDragOver: e => {
          e.preventDefault();
        },
        onDrop: e => {
          e.preventDefault();
          const url = e.dataTransfer.getData("text/plain");
          addBlockedUrl(url);
          this.scrollToBottom();
        },
      },
      this.renderEnableBar(),
      this.renderBlockedList(),
      this.renderAddForm(),
      !blockedUrls.length && this.renderEmptyListNotice()
    );
  }
}

module.exports = connect(
  state => ({
    blockedUrls: state.requestBlocking.blockedUrls,
    blockingEnabled: state.requestBlocking.blockingEnabled,
    isDisplaying: state.ui.selectedActionBarTabId === PANELS.BLOCKING,
  }),
  dispatch => ({
    toggleBlockingEnabled: checked =>
      dispatch(Actions.toggleBlockingEnabled(checked)),
    addBlockedUrl: url => dispatch(Actions.addBlockedUrl(url)),
    removeBlockedUrl: url => dispatch(Actions.removeBlockedUrl(url)),
    toggleBlockedUrl: url => dispatch(Actions.toggleBlockedUrl(url)),
    removeAllBlockedUrls: () => dispatch(Actions.removeAllBlockedUrls()),
    enableAllBlockedUrls: () => dispatch(Actions.enableAllBlockedUrls()),
    disableAllBlockedUrls: () => dispatch(Actions.disableAllBlockedUrls()),
    updateBlockedUrl: (oldUrl, newUrl) =>
      dispatch(Actions.updateBlockedUrl(oldUrl, newUrl)),
  })
)(RequestBlockingPanel);
