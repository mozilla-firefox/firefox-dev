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
  getUrlHost,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");

loader.lazyGetter(
  this,
  "l10n",
  () => new Localization(["devtools/client/netmonitor.ftl"], true)
);

// Components
const TreeViewClass = ChromeUtils.importESModule(
  "resource://devtools/client/shared/components/tree/TreeView.mjs"
).default;
const PropertiesView = createFactory(
  require("resource://devtools/client/netmonitor/src/components/request-details/PropertiesView.js")
);

loader.lazyGetter(this, "Rep", function () {
  return ChromeUtils.importESModule(
    "resource://devtools/client/shared/components/reps/index.mjs"
  ).REPS.Rep;
});
loader.lazyGetter(this, "MODE", function () {
  return ChromeUtils.importESModule(
    "resource://devtools/client/shared/components/reps/index.mjs"
  ).MODE;
});

const { div, span } = dom;
// the panel is rendered as a property tree, so most of these strings end up as
// object keys and are compared by identity in renderValue
loader.lazyGetter(this, "LABELS", () => ({
  notAvailable: l10n.formatValueSync("netmonitor-security-not-available"),
  error: l10n.formatValueSync("netmonitor-security-error"),
  cipherSuite: l10n.formatValueSync("netmonitor-security-cipher-suite"),
  warningCipher: l10n.formatValueSync("netmonitor-security-warning-cipher"),
  enabled: l10n.formatValueSync("netmonitor-security-enabled"),
  disabled: l10n.formatValueSync("netmonitor-security-disabled"),
  connection: l10n.formatValueSync("netmonitor-security-connection"),
  protocolVersion: l10n.formatValueSync("netmonitor-security-protocol-version"),
  keaGroup: l10n.formatValueSync("netmonitor-security-kea-group"),
  keaGroupNone: l10n.formatValueSync("netmonitor-security-kea-group-none"),
  keaGroupCustom: l10n.formatValueSync("netmonitor-security-kea-group-custom"),
  keaGroupUnknown: l10n.formatValueSync(
    "netmonitor-security-kea-group-unknown"
  ),
  signatureScheme: l10n.formatValueSync("netmonitor-security-signature-scheme"),
  signatureSchemeNone: l10n.formatValueSync(
    "netmonitor-security-signature-scheme-none"
  ),
  signatureSchemeUnknown: l10n.formatValueSync(
    "netmonitor-security-signature-scheme-unknown"
  ),
  usedEch: l10n.formatValueSync("netmonitor-security-used-ech"),
  usedDelegatedCredentials: l10n.formatValueSync(
    "netmonitor-security-used-delegated-credentials"
  ),
  usedOcsp: l10n.formatValueSync("netmonitor-security-used-ocsp"),
  usedPrivateDns: l10n.formatValueSync("netmonitor-security-used-private-dns"),
  hsts: l10n.formatValueSync("netmonitor-security-hsts"),
  hpkp: l10n.formatValueSync("netmonitor-security-hpkp"),
  certificate: l10n.formatValueSync("netmonitor-security-certificate"),
  certSubjectInfo: l10n.formatValueSync(
    "netmonitor-security-cert-subject-info"
  ),
  certIssuerInfo: l10n.formatValueSync("netmonitor-security-cert-issuer-info"),
  certCommonName: l10n.formatValueSync("netmonitor-security-cert-common-name"),
  certOrganization: l10n.formatValueSync(
    "netmonitor-security-cert-organization"
  ),
  certOrganizationalUnit: l10n.formatValueSync(
    "netmonitor-security-cert-organizational-unit"
  ),
  certPeriodOfValidity: l10n.formatValueSync(
    "netmonitor-security-cert-period-of-validity"
  ),
  certBegins: l10n.formatValueSync("netmonitor-security-cert-begins"),
  certExpires: l10n.formatValueSync("netmonitor-security-cert-expires"),
  certFingerprints: l10n.formatValueSync(
    "netmonitor-security-cert-fingerprints"
  ),
  certSha256Fingerprint: l10n.formatValueSync(
    "netmonitor-security-cert-sha256-fingerprint"
  ),
  certSha1Fingerprint: l10n.formatValueSync(
    "netmonitor-security-cert-sha1-fingerprint"
  ),
  certTransparency: l10n.formatValueSync(
    "netmonitor-security-cert-transparency"
  ),
  certTransparencyOk: l10n.formatValueSync(
    "netmonitor-security-cert-transparency-status-ok"
  ),
  certTransparencyNotEnoughScts: l10n.formatValueSync(
    "netmonitor-security-cert-transparency-status-not-enough-scts"
  ),
  certTransparencyNotDiverseScts: l10n.formatValueSync(
    "netmonitor-security-cert-transparency-status-not-diverse-scts"
  ),
}));

/*
 * Localize special values for key exchange group name,
 * certificate signature scheme, and certificate
 * transparency status.
 */
const formatSecurityInfo = securityInfo => {
  const formattedSecurityInfo = { ...securityInfo };

  const formatters = {
    keaGroupName: value => {
      if (value === "none") {
        return LABELS.keaGroupNone;
      }
      if (value === "custom") {
        return LABELS.keaGroupCustom;
      }
      if (value === "unknown group") {
        return LABELS.keaGroupUnknown;
      }
      return value;
    },
    signatureSchemeName: value => {
      if (value === "none") {
        return LABELS.signatureSchemeNone;
      }
      if (value === "unknown signature") {
        return LABELS.signatureSchemeUnknown;
      }
      return value;
    },
    certificateTransparency: value => {
      if (value === 5) {
        return LABELS.certTransparencyOk;
      }
      if (value === 6) {
        return LABELS.certTransparencyNotEnoughScts;
      }
      if (value === 7) {
        return LABELS.certTransparencyNotDiverseScts;
      }
      return value;
    },
  };

  return Object.keys(formatters).reduce((acc, key) => {
    const formatter = formatters[key];
    acc[key] = formatter(acc[key]);
    return acc;
  }, formattedSecurityInfo);
};

const getConnectionLabel = securityInfo => ({
  [LABELS.protocolVersion]: securityInfo.protocolVersion || LABELS.notAvailable,
  [LABELS.cipherSuite]: securityInfo.cipherSuite || LABELS.notAvailable,
  [LABELS.keaGroup]: securityInfo.keaGroupName || LABELS.notAvailable,
  [LABELS.signatureScheme]:
    securityInfo.signatureSchemeName || LABELS.notAvailable,
  [LABELS.usedEch]: securityInfo.usedEch,
  [LABELS.usedDelegatedCredentials]: securityInfo.usedDelegatedCredentials,
  [LABELS.usedOcsp]: securityInfo.usedOcsp,
  [LABELS.usedPrivateDns]: securityInfo.usedPrivateDns,
});

const getHostHeaderLabel = securityInfo => ({
  [LABELS.hsts]: securityInfo.hsts ? LABELS.enabled : LABELS.disabled,
  [LABELS.hpkp]: securityInfo.hpkp ? LABELS.enabled : LABELS.disabled,
});

const getCertificateLabel = securityInfo => {
  const { fingerprint, issuer, subject, validity } = securityInfo.cert;

  return {
    [LABELS.certSubjectInfo]: {
      [LABELS.certCommonName]: subject?.commonName || LABELS.notAvailable,
      [LABELS.certOrganization]: subject?.organization || LABELS.notAvailable,
      [LABELS.certOrganizationalUnit]:
        subject?.organizationUnit || LABELS.notAvailable,
    },
    [LABELS.certIssuerInfo]: {
      [LABELS.certCommonName]: issuer?.commonName || LABELS.notAvailable,
      [LABELS.certOrganization]: issuer?.organization || LABELS.notAvailable,
      [LABELS.certOrganizationalUnit]:
        issuer?.organizationUnit || LABELS.notAvailable,
    },
    [LABELS.certPeriodOfValidity]: {
      [LABELS.certBegins]: validity?.start || LABELS.notAvailable,
      [LABELS.certExpires]: validity?.end || LABELS.notAvailable,
    },
    [LABELS.certFingerprints]: {
      [LABELS.certSha256Fingerprint]:
        fingerprint?.sha256 || LABELS.notAvailable,
      [LABELS.certSha1Fingerprint]: fingerprint?.sha1 || LABELS.notAvailable,
    },
    [LABELS.certTransparency]:
      securityInfo.certificateTransparency || LABELS.notAvailable,
  };
};

const getObject = ({ securityInfo, url }) => {
  if (
    !securityInfo.state.startsWith("secure") &&
    securityInfo.state !== "weak"
  ) {
    return {
      [LABELS.error]: securityInfo.errorMessage || LABELS.notAvailable,
    };
  }

  const hostHeaderLabel = l10n.formatValueSync(
    "netmonitor-security-host-header",
    { host: getUrlHost(url) }
  );
  const formattedSecurityInfo = formatSecurityInfo(securityInfo);

  return {
    [LABELS.connection]: getConnectionLabel(formattedSecurityInfo),
    [hostHeaderLabel]: getHostHeaderLabel(formattedSecurityInfo),
    [LABELS.certificate]: getCertificateLabel(formattedSecurityInfo),
  };
};

/*
 * Security panel component
 * If the site is being served over HTTPS, you get an extra tab labeled "Security".
 * This contains details about the secure connection used including the protocol,
 * the cipher suite, and certificate details
 */
class SecurityPanel extends Component {
  static get propTypes() {
    return {
      connector: PropTypes.object.isRequired,
      openLink: PropTypes.func,
      request: PropTypes.object.isRequired,
    };
  }

  componentDidMount() {
    const { request, connector } = this.props;
    fetchNetworkUpdatePacket(connector.requestData, request, ["securityInfo"]);
  }

  // FIXME: https://bugzilla.mozilla.org/show_bug.cgi?id=1774507
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { request, connector } = nextProps;
    fetchNetworkUpdatePacket(connector.requestData, request, ["securityInfo"]);
  }

  renderValue(props, weaknessReasons = []) {
    const { member, value } = props;

    // Hide object summary
    if (typeof member.value === "object") {
      return null;
    }

    return span(
      { className: "security-info-value" },
      member.name === LABELS.error
        ? // Display multiline text for security error for a label using a rep.
          value
        : Rep(
            Object.assign(props, {
              // FIXME: A workaround for the issue in StringRep
              // Force StringRep to crop the text everytime
              member: Object.assign({}, member, { open: false }),
              mode: MODE.TINY,
              cropLimit: 60,
              noGrip: true,
            })
          ),
      weaknessReasons.includes("cipher") && member.name === LABELS.cipherSuite
        ? // Display an extra warning icon after the cipher suite
          div({
            id: "security-warning-cipher",
            className: "security-warning-icon",
            title: LABELS.warningCipher,
          })
        : null
    );
  }

  render() {
    const { request } = this.props;
    const { securityInfo, url } = request;

    if (!securityInfo || !url) {
      return null;
    }

    const object = getObject({ securityInfo, url });
    return div(
      { className: "panel-container security-panel" },
      PropertiesView({
        object,
        renderValue: props =>
          this.renderValue(props, securityInfo.weaknessReasons),
        enableFilter: false,
        expandedNodes: TreeViewClass.getExpandedNodes(object),
      })
    );
  }
}

module.exports = SecurityPanel;
