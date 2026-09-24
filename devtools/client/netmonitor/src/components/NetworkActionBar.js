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
const {
  div,
} = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Actions = require("resource://devtools/client/netmonitor/src/actions/index.js");
const {
  PANELS,
} = require("resource://devtools/client/netmonitor/src/constants.js");

const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");

const Tabbar = createFactory(
  require("resource://devtools/client/shared/components/tabs/TabBar.js")
);
const TabPanel = createFactory(
  ChromeUtils.importESModule(
    "resource://devtools/client/shared/components/tabs/Tabs.mjs"
  ).TabPanel
);

loader.lazyGetter(this, "SearchPanel", function () {
  return createFactory(
    require("resource://devtools/client/netmonitor/src/components/search/SearchPanel.js")
  );
});

loader.lazyGetter(this, "RequestBlockingPanel", function () {
  return createFactory(
    require("resource://devtools/client/netmonitor/src/components/request-blocking/RequestBlockingPanel.js")
  );
});

loader.lazyGetter(this, "HTTPCustomRequestPanel", function () {
  return createFactory(
    require("resource://devtools/client/netmonitor/src/components/new-request/HTTPCustomRequestPanel.js")
  );
});

class NetworkActionBar extends Component {
  static get propTypes() {
    return {
      connector: PropTypes.object.isRequired,
      getString: PropTypes.func.isRequired,
      selectedActionBarTabId: PropTypes.string,
      selectActionBarTab: PropTypes.func.isRequired,
      toggleNetworkActionBar: PropTypes.func.isRequired,
    };
  }

  render() {
    const {
      connector,
      getString,
      selectedActionBarTabId,
      selectActionBarTab,
      toggleNetworkActionBar,
    } = this.props;

    // The request blocking and search panels are available behind a pref
    const showBlockingPanel = Services.prefs.getBoolPref(
      "devtools.netmonitor.features.requestBlocking"
    );
    const showNewCustomRequestPanel = Services.prefs.getBoolPref(
      "devtools.netmonitor.features.newEditAndResend"
    );

    return div(
      { className: "network-action-bar" },
      Tabbar(
        {
          activeTabId: selectedActionBarTabId,
          onSelect: id => selectActionBarTab(id),
          sidebarToggleButton: {
            collapsed: false,
            collapsePaneTitle: getString("netmonitor-collapse-action-pane"),
            expandPaneTitle: "",
            onClick: toggleNetworkActionBar,
            alignRight: true,
            canVerticalSplit: false,
          },
        },
        showNewCustomRequestPanel &&
          TabPanel(
            {
              id: PANELS.HTTP_CUSTOM_REQUEST,
              title: getString("netmonitor-actionbar-http-custom-request"),
              className: "network-action-bar-HTTP-custom-request",
            },
            HTTPCustomRequestPanel({ connector })
          ),
        TabPanel(
          {
            id: PANELS.SEARCH,
            title: getString("netmonitor-actionbar-search"),
            className: "network-action-bar-search",
          },
          SearchPanel({ connector })
        ),
        showBlockingPanel &&
          TabPanel(
            {
              id: PANELS.BLOCKING,
              title: getString("netmonitor-actionbar-request-blocking"),
              className: "network-action-bar-blocked",
            },
            RequestBlockingPanel()
          )
      )
    );
  }
}

module.exports = FluentReact.withLocalization(
  connect(
    state => ({
      selectedActionBarTabId: state.ui.selectedActionBarTabId,
    }),
    dispatch => ({
      selectActionBarTab: id => dispatch(Actions.selectActionBarTab(id)),
      toggleNetworkActionBar: () => dispatch(Actions.toggleNetworkActionBar()),
    })
  )(NetworkActionBar)
);
