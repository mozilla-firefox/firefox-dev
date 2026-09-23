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
  fetchNetworkUpdatePacket,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);
const {
  sortObjectKeys,
} = require("resource://devtools/client/netmonitor/src/utils/sort-utils.js");
const {
  FILTER_SEARCH_DELAY,
} = require("resource://devtools/client/netmonitor/src/constants.js");

// Component
const PropertiesView = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/PropertiesView.js")
);
const SearchBox = createFactory(
  require("resource://devtools/client/shared/components/SearchBox.js")
);
const Accordion = createFactory(
  require("resource://devtools/client/shared/components/Accordion.js")
);

loader.lazyGetter(this, "TreeRow", function () {
  return createFactory(
    ChromeUtils.importESModule(
      "resource://devtools/client/shared/components/tree/TreeRow.mjs",
      { global: "current" }
    ).default
  );
});

const { div } = dom;

/*
 * Cookies panel component
 * This tab lists full details of any cookies sent with the request or response
 */
class CookiesPanel extends Component {
  static get propTypes() {
    return {
      connector: PropTypes.object.isRequired,
      openLink: PropTypes.func,
      request: PropTypes.object.isRequired,
      targetSearchResult: PropTypes.object,
      getString: PropTypes.func.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      filterText: "",
    };
    // passed to PropertiesView as a callback, so it needs its own `this`
    this.getTargetCookiePath = this.getTargetCookiePath.bind(this);
  }

  componentDidMount() {
    const { connector, request } = this.props;
    fetchNetworkUpdatePacket(connector.requestData, request, [
      "requestCookies",
      "responseCookies",
    ]);
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { connector, request } = nextProps;
    fetchNetworkUpdatePacket(connector.requestData, request, [
      "requestCookies",
      "responseCookies",
    ]);
  }

  /**
   * Mapping array to dict for TreeView usage.
   * Since TreeView only support Object(dict) format.
   *
   * @param {object[]} arr - key-value pair array like cookies or params
   * @returns {object}
   */
  getProperties(arr, title) {
    const cookies = arr.reduce((map, obj) => {
      // Generally cookies object contains only name and value properties and can
      // be rendered as name: value pair.
      // When there are more properties in cookies object such as extra or path,
      // We will pass the object to display these extra information
      if (Object.keys(obj).length > 2) {
        map[obj.name] = Object.assign({}, obj);
        delete map[obj.name].name;
      } else {
        map[obj.name] = obj.value;
      }
      return map;
    }, Object.create(null));

    // To have different roots for Request and Response cookies
    return { [title]: cookies };
  }

  /**
   * Custom rendering method passed to PropertiesView. It's
   * responsible to filter out level 0 node in the tree
   *
   * @param {object} props
   */
  renderRow(props) {
    const { level } = props.member;

    if (level === 0) {
      return null;
    }

    return TreeRow(props);
  }

  /**
   * Get the selected cookies path
   *
   * @param {object} searchResult
   * @returns {string}
   */
  getTargetCookiePath(searchResult) {
    if (!searchResult) {
      return null;
    }

    const { getString } = this.props;

    switch (searchResult.type) {
      case "requestCookies": {
        return `/${getString("netmonitor-request-cookies")}/${
          searchResult.label
        }`;
      }
      case "responseCookies":
        return `/${getString("netmonitor-response-cookies")}/${
          searchResult.label
        }`;
    }

    return null;
  }

  render() {
    let {
      request: {
        requestCookies = { cookies: [] },
        responseCookies = { cookies: [] },
      },
      targetSearchResult,
      getString,
    } = this.props;

    const { filterText } = this.state;
    const requestCookiesLabel = getString("netmonitor-request-cookies");
    const responseCookiesLabel = getString("netmonitor-response-cookies");

    requestCookies = requestCookies.cookies || requestCookies;
    responseCookies = responseCookies.cookies || responseCookies;

    if (!requestCookies.length && !responseCookies.length) {
      return Localized(
        { id: "netmonitor-cookies-empty-text" },
        div({ className: "empty-notice" })
      );
    }

    const items = [];

    if (responseCookies.length) {
      items.push({
        component: PropertiesView,
        componentProps: {
          object: sortObjectKeys(
            this.getProperties(responseCookies, responseCookiesLabel)
          ),
          filterText,
          targetSearchResult,
          defaultSelectFirstNode: false,
          selectPath: this.getTargetCookiePath,
          renderRow: this.renderRow,
        },
        header: responseCookiesLabel,
        id: "responseCookies",
        opened: true,
      });
    }

    if (requestCookies.length) {
      items.push({
        component: PropertiesView,
        componentProps: {
          object: sortObjectKeys(
            this.getProperties(requestCookies, requestCookiesLabel)
          ),
          filterText,
          targetSearchResult,
          defaultSelectFirstNode: false,
          selectPath: this.getTargetCookiePath,
          renderRow: this.renderRow,
        },
        header: requestCookiesLabel,
        id: "requestCookies",
        opened: true,
      });
    }

    return div(
      { className: "panel-container cookies-panel-container" },
      div(
        { className: "devtools-toolbar devtools-input-toolbar" },
        SearchBox({
          delay: FILTER_SEARCH_DELAY,
          type: "filter",
          initialValue: filterText,
          onChange: text => this.setState({ filterText: text }),
          placeholder: getString("netmonitor-cookies-filter-text"),
        })
      ),
      Accordion({ items })
    );
  }
}

module.exports = FluentReact.withLocalization(CookiesPanel);
