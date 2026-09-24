/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const {
  PANELS,
} = require("resource://devtools/client/netmonitor/src/constants.js");
const {
  getOverriddenUrl,
} = require("resource://devtools/client/netmonitor/src/selectors/index.js");

// Components
const Tabbar = createFactory(
  require("resource://devtools/client/shared/components/tabs/TabBar.js")
);
const TabPanel = createFactory(
  ChromeUtils.importESModule(
    "resource://devtools/client/shared/components/tabs/Tabs.mjs"
  ).TabPanel
);
const CookiesPanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/CookiesPanel.js")
);
const HeadersPanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/HeadersPanel.js")
);
const RequestPanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/RequestPanel.js")
);
const CachePanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/CachePanel.js")
);
const ResponsePanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/ResponsePanel.js")
);
const SecurityPanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/SecurityPanel.js")
);
const StackTracePanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/StackTracePanel.js")
);
const TimingsPanel = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/TimingsPanel.js")
);

/**
 * Tabbox panel component
 * Display the network request details
 */
class TabboxPanel extends Component {
  static get propTypes() {
    return {
      activeTabId: PropTypes.string,
      cloneSelectedRequest: PropTypes.func,
      connector: PropTypes.object.isRequired,
      getString: PropTypes.func.isRequired,
      openLink: PropTypes.func,
      request: PropTypes.object,
      selectTab: PropTypes.func.isRequired,
      sourceMapURLService: PropTypes.object,
      hideToggleButton: PropTypes.bool,
      toggleNetworkDetails: PropTypes.func,
      openNetworkDetails: PropTypes.func.isRequired,
      showMessagesView: PropTypes.bool,
      targetSearchResult: PropTypes.object,
      defaultRawResponse: PropTypes.bool,
      setDefaultRawResponse: PropTypes.func,
      isOverridden: PropTypes.bool,
      overriddenUrl: PropTypes.string,
    };
  }
  static get defaultProps() {
    return {
      showMessagesView: true,
    };
  }
  componentDidMount() {
    this.closeOnEscRef = this.closeOnEsc.bind(this);
    window.addEventListener("keydown", this.closeOnEscRef);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.closeOnEscRef);
  }

  closeOnEsc(event) {
    if (event.key == "Escape") {
      event.preventDefault();
      // Don't take focus when the keyboard shortcut is triggered in a CodeMirror instance,
      // so the CodeMirror search UI is closed.
      if (event.target.closest(".cm-search")) {
        return;
      }
      this.props.openNetworkDetails(false);
    }
  }

  render() {
    const {
      activeTabId,
      cloneSelectedRequest = () => {},
      connector,
      getString,
      hideToggleButton,
      openLink,
      defaultRawResponse,
      isOverridden,
      overriddenUrl,
      request,
      selectTab,
      setDefaultRawResponse,
      sourceMapURLService,
      toggleNetworkDetails,
      targetSearchResult,
    } = this.props;

    if (!request) {
      return null;
    }

    const isWs = request.cause.type === "websocket";
    const isSse = request.isEventStream;

    const showMessagesView = (isWs || isSse) && this.props.showMessagesView;
    const responseTitle = getString("netmonitor-tab-response");
    return Tabbar(
      {
        activeTabId,
        menuDocument: window.parent.document,
        onSelect: selectTab,
        renderOnlySelected: true,
        showAllTabsMenu: true,
        allTabsMenuButtonTooltip: getString(
          "netmonitor-all-tabs-menu-button-tooltip"
        ),
        sidebarToggleButton: hideToggleButton
          ? null
          : {
              collapsed: false,
              collapsePaneTitle: getString("netmonitor-collapse-details-pane"),
              expandPaneTitle: "",
              onClick: toggleNetworkDetails,
            },
      },
      TabPanel(
        {
          id: PANELS.HEADERS,
          title: getString("netmonitor-tab-headers"),
          className: "panel-with-code",
        },
        HeadersPanel({
          cloneSelectedRequest,
          connector,
          openLink,
          request,
          targetSearchResult,
        })
      ),
      TabPanel(
        {
          id: PANELS.COOKIES,
          title: getString("netmonitor-tab-cookies"),
          className: "panel-with-code",
        },
        CookiesPanel({
          connector,
          openLink,
          request,
          targetSearchResult,
        })
      ),
      TabPanel(
        {
          id: PANELS.REQUEST,
          title: getString("netmonitor-tab-request"),
          className: "panel-with-code",
        },
        RequestPanel({
          connector,
          openLink,
          request,
          targetSearchResult,
        })
      ),
      TabPanel(
        {
          id: PANELS.RESPONSE,
          title: responseTitle,
          className:
            "panel-with-code" +
            (isOverridden ? " tab-response-overridden" : ""),
          tooltip: isOverridden
            ? getString("netmonitor-tab-response-overridden-tooltip", {
                path: overriddenUrl,
              })
            : responseTitle,
        },
        ResponsePanel({
          request,
          openLink,
          connector,
          showMessagesView,
          targetSearchResult,
          defaultRawResponse,
          setDefaultRawResponse,
        })
      ),
      (request.fromCache || request.status == "304") &&
        TabPanel(
          {
            id: PANELS.CACHE,
            title: getString("netmonitor-tab-cache"),
          },
          CachePanel({ request, openLink, connector })
        ),
      TabPanel(
        {
          id: PANELS.TIMINGS,
          title: getString("netmonitor-tab-timings"),
        },
        TimingsPanel({
          connector,
          request,
        })
      ),
      request.cause?.stacktraceAvailable &&
        TabPanel(
          {
            id: PANELS.STACK_TRACE,
            title: getString("netmonitor-tab-stack-trace"),
            className: "panel-with-code",
          },
          StackTracePanel({ connector, openLink, request, sourceMapURLService })
        ),
      request.securityState &&
        request.securityState !== "insecure" &&
        TabPanel(
          {
            id: PANELS.SECURITY,
            title: getString("netmonitor-tab-security"),
          },
          SecurityPanel({
            connector,
            openLink,
            request,
          })
        )
    );
  }
}

const LocalizedTabboxPanel = FluentReact.withLocalization(TabboxPanel);

module.exports = {
  ConnectedTabboxPanel: connect(
    (state, props) => {
      const overriddenUrl = getOverriddenUrl(
        state,
        props.request.urlDetails?.url
      );
      return {
        isOverridden: !!overriddenUrl,
        overriddenUrl,
      };
    },
    {},
    undefined,
    { storeKey: "toolbox-store" }
  )(LocalizedTabboxPanel),
  // Export the non-connected variant of the component for the browser console
  // which might not have toolbox store available.
  TabboxPanel: LocalizedTabboxPanel,
};
