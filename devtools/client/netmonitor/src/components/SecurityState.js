/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  Component,
  createFactory,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const {
  div,
} = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");
const {
  L10N,
} = require("resource://devtools/client/netmonitor/src/utils/l10n.js");
const {
  propertiesEqual,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");
const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);

const UPDATED_DOMAIN_PROPS = ["remoteAddress", "securityState", "urlDetails"];

const SECURITY_STATE_L10N_IDS = {
  "secure-custom-root": "netmonitor-security-state-secure-custom-root",
  secure: "netmonitor-security-state-secure",
  insecure: "netmonitor-security-state-insecure",
  broken: "netmonitor-security-state-broken",
  weak: "netmonitor-security-state-weak",
};

class SecurityState extends Component {
  static get propTypes() {
    return {
      item: PropTypes.object.isRequired,
      onSecurityIconMouseDown: PropTypes.func.isRequired,
    };
  }

  shouldComponentUpdate(nextProps) {
    return !propertiesEqual(
      UPDATED_DOMAIN_PROPS,
      this.props.item,
      nextProps.item
    );
  }

  render() {
    const { item, onSecurityIconMouseDown } = this.props;

    const {
      securityState,
      urlDetails: { isLocal },
    } = item;
    const iconClassList = ["requests-security-state-icon"];

    let l10nId;
    let realSecurityState = securityState;

    // Locally delivered files such as http://localhost and file:// paths
    // are considered to have been delivered securely.
    if (isLocal) {
      realSecurityState = "secure";
    }

    if (realSecurityState) {
      iconClassList.push(`security-state-${realSecurityState}`);
      l10nId = SECURITY_STATE_L10N_IDS[realSecurityState];
    }

    const icon = div({
      className: iconClassList.join(" "),
      onMouseDown: onSecurityIconMouseDown,
    });

    return div(
      { className: "requests-security-icon-group" },
      l10nId ? Localized({ id: l10nId, attrs: { title: true } }, icon) : icon,
      item.isThirdPartyTrackingResource &&
        div({
          className: "tracking-resource",
          title: L10N.getStr("netmonitor.trackingResource.tooltip"),
        })
    );
  }
}

module.exports = SecurityState;
