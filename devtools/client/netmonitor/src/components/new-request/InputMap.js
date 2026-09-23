/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
  createRef,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);
const { div, input, textarea, button } = dom;

/**
 * Editable name and value list component with optional form to add new items
 */
class InputMap extends Component {
  static get propTypes() {
    return {
      list: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired,
          disabled: PropTypes.bool,
        })
      ).isRequired,
      onUpdate: PropTypes.func,
      onAdd: PropTypes.func,
      onDelete: PropTypes.func,
      onChange: PropTypes.func,
      onChecked: PropTypes.func,
    };
  }

  constructor(props) {
    super(props);

    this.listRef = createRef();

    this.state = {
      name: "",
      value: "",
    };
  }

  render() {
    const { list, onUpdate, onAdd, onDelete, onChecked } = this.props;
    const { name, value } = this.state;

    // Adds a new item with name and value when the user starts typing on the form
    const onKeyDown = event => {
      const { target } = event;
      onAdd(name, value);
      this.setState({ name: "", value: "" }, () => {
        // Get next to last child on the list,
        // because that was the item that was just added and
        // we need to focous on it, so the user can keep editing it.
        const targetParentNode =
          this.listRef.current.childNodes?.[
            this.listRef.current.childElementCount - 2
          ];
        targetParentNode?.querySelector(`.${target.className}`).focus();
      });
    };

    return div(
      {
        ref: this.listRef,
        className: "http-custom-input-and-map-form",
      },
      list.map((item, index) => {
        return div(
          {
            className: "tabpanel-summary-container http-custom-input",
            id: `http-custom-${item.name.toLowerCase()}`,
            key: index,
          },
          input({
            className: "tabpanel-summary-input-checkbox",
            name: `checked-${index}`,
            type: "checkbox",
            onChange: event => {
              onChecked(index, event.target.checked);
            },
            checked: item.checked,
            disabled: !!item.disabled,
            wrap: "off",
          }),
          div(
            { className: "tabpanel-summary-input-name" },
            div(
              {
                className: "auto-growing-textarea",
                "data-replicated-value": item.name,
                title: item.name,
              },
              textarea({
                className: "http-custom-input-name",
                name: `name-${index}`,
                value: item.name,
                disabled: !!item.disabled,
                onChange: event => {
                  onUpdate(event);
                },
                rows: 1,
              })
            )
          ),
          div(
            { className: "tabpanel-summary-input-value" },
            div(
              {
                className: "auto-growing-textarea",
                "data-replicated-value": item.value,
                title: item.value,
              },
              textarea({
                className: "http-custom-input-value",
                name: `value-${index}`,
                placeholder: "value",
                disabled: !!item.disabled,
                onChange: event => {
                  onUpdate(event);
                },
                value: item.value,
                rows: 1,
              })
            )
          ),
          !item.disabled &&
            onDelete &&
            Localized(
              {
                id: "netmonitor-custom-remove-item",
                attrs: { title: true, "aria-label": true },
              },
              button({
                className: "http-custom-delete-button",
                onClick: () => onDelete(index),
              })
            )
        );
      }),
      onAdd &&
        div(
          {
            className: "map-add-new-inputs",
          },
          input({
            className: "tabpanel-summary-input-checkbox",
            onChange: () => {},
            checked: true,
            type: "checkbox",
          }),
          div(
            { className: "tabpanel-summary-input-name" },
            div(
              {
                className: "auto-growing-textarea",
                "data-replicated-value": name,
                title: value,
              },
              Localized(
                {
                  id: "netmonitor-custom-placeholder-name",
                  attrs: { placeholder: true },
                },
                textarea({
                  className: "http-custom-input-name",
                  type: "text",
                  ref: "addInputName",
                  checked: true,
                  value: name,
                  rows: 1,
                  onChange: e => this.setState({ name: e.target.value }),
                  onKeyDown,
                })
              )
            )
          ),
          div(
            { className: "tabpanel-summary-input-value" },
            div(
              {
                className: "auto-growing-textarea",
                "data-replicated-value": value,
                title: value,
              },
              Localized(
                {
                  id: "netmonitor-custom-placeholder-value",
                  attrs: { placeholder: true },
                },
                textarea({
                  className: "http-custom-input-value",
                  type: "text",
                  ref: "addInputValue",
                  value,
                  onChange: e => this.setState({ value: e.target.value }),
                  rows: 1,
                  onKeyDown,
                })
              )
            )
          )
        )
    );
  }
}

module.exports = InputMap;
