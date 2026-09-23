/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  showMenu,
} = require("resource://devtools/client/shared/components/menu/utils.js");
const {
  HEADERS,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const {
  getVisibleColumns,
} = require("resource://devtools/client/netmonitor/src/selectors/index.js");

const l10nIdMap = HEADERS.filter(header =>
  header.hasOwnProperty("l10nId")
).reduce((acc, { name, l10nId }) => Object.assign(acc, { [name]: l10nId }), {});

const subMenuMap = HEADERS.filter(header =>
  header.hasOwnProperty("subMenu")
).reduce(
  (acc, { name, subMenu }) => Object.assign(acc, { [name]: subMenu }),
  {}
);

loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

class RequestListHeaderContextMenu {
  constructor(props) {
    this.props = props;
  }

  /**
   * Handle the context menu opening.
   */
  open(event = {}, columns) {
    const menu = [];
    const subMenu = { timings: [], responseHeaders: [] };
    const onlyOneColumn =
      getVisibleColumns(columns).filter(([column]) => column !== "override")
        .length === 1;

    for (const column in columns) {
      const shown = columns[column];
      const label = l10nIdMap[column]
        ? l10n.formatValueSync(l10nIdMap[column])
        : column;
      const entry = {
        id: `request-list-header-${column}-toggle`,
        label,
        type: "checkbox",
        checked: shown,
        click: () => this.props.toggleColumn(column),
        // We don't want to allow hiding the last visible column,
        // or to modify the visibility of the override column.
        disabled: (onlyOneColumn && shown) || column === "override",
      };
      subMenuMap.hasOwnProperty(column)
        ? subMenu[subMenuMap[column]].push(entry)
        : menu.push(entry);
    }

    menu.push({ type: "separator" });
    menu.push({
      label: l10n.formatValueSync("netmonitor-toolbar-timings"),
      submenu: subMenu.timings,
    });
    menu.push({
      label: l10n.formatValueSync("netmonitor-toolbar-response-headers"),
      submenu: subMenu.responseHeaders,
    });

    menu.push({ type: "separator" });
    menu.push({
      id: "request-list-header-reset-columns",
      label: l10n.formatValueSync("netmonitor-toolbar-reset-columns"),
      click: () => this.props.resetColumns(),
    });

    menu.push({
      id: "request-list-header-reset-sorting",
      label: l10n.formatValueSync("netmonitor-toolbar-reset-sorting"),
      click: () => this.props.resetSorting(),
    });

    const columnName = event.target.getAttribute("data-name");

    menu.push({
      id: "request-list-header-resize-column-to-fit-content",
      label: l10n.formatValueSync(
        "netmonitor-toolbar-resize-column-to-fit-content"
      ),
      click: () => this.props.resizeColumnToFitContent(columnName),
    });

    showMenu(menu, {
      screenX: event.screenX,
      screenY: event.screenY,
    });
  }
}

module.exports = RequestListHeaderContextMenu;
