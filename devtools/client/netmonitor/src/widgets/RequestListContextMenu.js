/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  formDataURI,
  getUrlQuery,
  getUrlBaseName,
  parseQueryString,
  getRequestHeadersRawText,
} = require("resource://devtools/client/netmonitor/src/utils/request-utils.js");
const {
  hasMatchingBlockingRequestPattern,
} = require("resource://devtools/client/netmonitor/src/utils/request-blocking.js");
const {
  getMenuItemStrings,
} = require("resource://devtools/client/netmonitor/src/utils/l10n.js");

loader.lazyRequireGetter(
  this,
  "Curl",
  "resource://devtools/client/shared/curl.js",
  true
);
loader.lazyRequireGetter(
  this,
  "saveAs",
  "resource://devtools/shared/DevToolsUtils.js",
  true
);
loader.lazyRequireGetter(
  this,
  "PowerShell",
  "resource://devtools/client/netmonitor/src/utils/powershell.js",
  true
);
loader.lazyRequireGetter(
  this,
  "copyString",
  "resource://devtools/shared/platform/clipboard.js",
  true
);
loader.lazyRequireGetter(
  this,
  "showMenu",
  "resource://devtools/client/shared/components/menu/utils.js",
  true
);
loader.lazyRequireGetter(
  this,
  "HarMenuUtils",
  "resource://devtools/client/netmonitor/src/har/har-menu-utils.js",
  true
);
loader.lazyRequireGetter(
  this,
  ["setNetworkOverride", "removeNetworkOverride"],
  "resource://devtools/client/framework/actions/index.js",
  true
);
loader.lazyRequireGetter(
  this,
  "getOverriddenUrl",
  "resource://devtools/client/netmonitor/src/selectors/index.js",
  true
);
loader.lazyRequireGetter(
  this,
  "openRequestInTab",
  "resource://devtools/client/netmonitor/src/utils/firefox/open-request-in-tab.js",
  true
);

const { OS } = Services.appinfo;

class RequestListContextMenu {
  constructor(props) {
    this.props = props;
  }

  createCopySubMenu(clickedRequest, requests) {
    const { connector } = this.props;

    const {
      id,
      formDataSections,
      method,
      mimeType,
      httpVersion,
      requestHeaders,
      requestHeadersAvailable,
      requestPostData,
      requestPostDataAvailable,
      responseHeaders,
      responseHeadersAvailable,
      responseContent,
      responseContentAvailable,
      url,
    } = clickedRequest;

    const copySubMenu = [];

    copySubMenu.push({
      id: "request-list-context-copy-url",
      ...getMenuItemStrings("netmonitor-context-copy-url"),
      visible: !!clickedRequest,
      click: () => this.copyUrl(url),
    });

    copySubMenu.push({
      id: "request-list-context-copy-url-params",
      ...getMenuItemStrings("netmonitor-context-copy-url-params"),
      visible: !!(clickedRequest && getUrlQuery(url)),
      click: () => this.copyUrlParams(url),
    });

    copySubMenu.push({
      id: "request-list-context-copy-post-data",
      ...getMenuItemStrings("netmonitor-context-copy-request-data", { method }),
      // Menu item will be visible even if data hasn't arrived, so we need to check
      // *Available property and then fetch data lazily once user triggers the action.
      visible: !!(
        clickedRequest &&
        (requestPostDataAvailable || requestPostData)
      ),
      click: () => this.copyPostData(id, formDataSections, requestPostData),
    });

    if (OS === "WINNT") {
      copySubMenu.push({
        id: "request-list-context-copy-as-curl-win",
        ...getMenuItemStrings("netmonitor-context-copy-as-curl-win"),
        // Menu item will be visible even if data hasn't arrived, so we need to check
        // *Available property and then fetch data lazily once user triggers the action.
        visible: !!clickedRequest,
        click: () =>
          this.copyAsCurl(
            id,
            url,
            method,
            httpVersion,
            requestHeaders,
            requestPostData,
            responseHeaders,
            "WINNT"
          ),
      });

      copySubMenu.push({
        id: "request-list-context-copy-as-curl-posix",
        ...getMenuItemStrings("netmonitor-context-copy-as-curl-posix"),
        // Menu item will be visible even if data hasn't arrived, so we need to check
        // *Available property and then fetch data lazily once user triggers the action.
        visible: !!clickedRequest,
        click: () =>
          this.copyAsCurl(
            id,
            url,
            method,
            httpVersion,
            requestHeaders,
            requestPostData,
            responseHeaders,
            "Linux"
          ),
      });
    } else {
      copySubMenu.push({
        id: "request-list-context-copy-as-curl",
        ...getMenuItemStrings("netmonitor-context-copy-as-curl"),
        // Menu item will be visible even if data hasn't arrived, so we need to check
        // *Available property and then fetch data lazily once user triggers the action.
        visible: !!clickedRequest,
        click: () =>
          this.copyAsCurl(
            id,
            url,
            method,
            httpVersion,
            requestHeaders,
            requestPostData,
            responseHeaders
          ),
      });
    }

    copySubMenu.push({
      id: "request-list-context-copy-as-powershell",
      ...getMenuItemStrings("netmonitor-context-copy-as-powershell"),
      // Menu item will be visible even if data hasn't arrived, so we need to check
      // *Available property and then fetch data lazily once user triggers the action.
      visible: !!clickedRequest,
      click: () => this.copyAsPowerShell(clickedRequest),
    });

    copySubMenu.push({
      id: "request-list-context-copy-as-fetch",
      ...getMenuItemStrings("netmonitor-context-copy-as-fetch"),
      visible: !!clickedRequest,
      click: () =>
        this.copyAsFetch(id, url, method, requestHeaders, requestPostData),
    });

    copySubMenu.push({
      type: "separator",
      visible: copySubMenu.slice(0, 4).some(subMenu => subMenu.visible),
    });

    copySubMenu.push({
      id: "request-list-context-copy-request-headers",
      ...getMenuItemStrings("netmonitor-context-copy-request-headers"),
      // Menu item will be visible even if data hasn't arrived, so we need to check
      // *Available property and then fetch data lazily once user triggers the action.
      visible: !!(
        clickedRequest &&
        (requestHeadersAvailable || requestHeaders)
      ),
      click: () => this.copyRequestHeaders(id, clickedRequest),
    });

    copySubMenu.push({
      id: "response-list-context-copy-response-headers",
      ...getMenuItemStrings("netmonitor-context-copy-response-headers"),
      // Menu item will be visible even if data hasn't arrived, so we need to check
      // *Available property and then fetch data lazily once user triggers the action.
      visible: !!(
        clickedRequest &&
        (responseHeadersAvailable || responseHeaders)
      ),
      click: () => this.copyResponseHeaders(id, responseHeaders),
    });

    copySubMenu.push({
      id: "request-list-context-copy-response",
      ...getMenuItemStrings("netmonitor-context-copy-response"),
      // Menu item will be visible even if data hasn't arrived, so we need to check
      // *Available property and then fetch data lazily once user triggers the action.
      visible: !!(
        clickedRequest &&
        (responseContentAvailable || responseContent)
      ),
      click: () => this.copyResponse(id, responseContent),
    });

    copySubMenu.push({
      id: "request-list-context-copy-image-as-data-uri",
      ...getMenuItemStrings("netmonitor-context-copy-image-as-data-uri"),
      visible: !!(
        clickedRequest &&
        (responseContentAvailable || responseContent) &&
        mimeType &&
        mimeType.includes("image/")
      ),
      click: () => this.copyImageAsDataUri(id, mimeType, responseContent),
    });

    copySubMenu.push({
      type: "separator",
      visible: copySubMenu.slice(5, 9).some(subMenu => subMenu.visible),
    });

    copySubMenu.push({
      id: "request-list-context-copy-all-as-har",
      ...getMenuItemStrings("netmonitor-context-copy-all-as-har"),
      visible: !!requests.length,
      click: () => HarMenuUtils.copyAllAsHar(requests, connector),
    });

    return copySubMenu;
  }

  createMenu(clickedRequest, requests, blockedUrls) {
    const {
      connector,
      cloneRequest,
      openDetailsPanelTab,
      openHTTPCustomRequestTab,
      closeHTTPCustomRequestTab,
      sendCustomRequest,
      sendHTTPCustomRequest,
      openStatistics,
      openRequestBlockingAndAddUrl,
      openRequestBlockingAndDisableUrls,
      removeBlockedUrl,
    } = this.props;

    const {
      id,
      isCustom,
      method,
      cause,
      isEventStream,
      mimeType,
      requestHeaders,
      requestPostData,
      responseContent,
      responseContentAvailable,
      url,
    } = clickedRequest;

    const toolbox = this.props.connector.getToolbox();
    const isOverridden = !!getOverriddenUrl(toolbox.store.getState(), url);
    const isLocalTab = toolbox.commands.descriptorFront.isLocalTab;

    const copySubMenu = this.createCopySubMenu(clickedRequest, requests);
    const newEditAndResendPref = Services.prefs.getBoolPref(
      "devtools.netmonitor.features.newEditAndResend"
    );

    return [
      {
        ...getMenuItemStrings("netmonitor-context-copy-value"),
        visible: true,
        submenu: copySubMenu,
      },
      {
        id: "request-list-context-save-as-har",
        ...getMenuItemStrings("netmonitor-context-save-as-har"),
        visible: !!clickedRequest,
        click: () => HarMenuUtils.saveAsHar(clickedRequest, connector),
      },
      {
        id: "request-list-context-save-all-as-har",
        ...getMenuItemStrings("netmonitor-context-save-all-as-har"),
        visible: !!requests.length,
        click: () => HarMenuUtils.saveAllAsHar(requests, connector),
      },
      {
        id: "request-list-context-save-response-as",
        ...getMenuItemStrings("netmonitor-context-save-response-as"),
        visible: !!(
          (responseContentAvailable || responseContent) &&
          mimeType &&
          // Websockets and server-sent events don't have a real 'response' for us to save
          cause.type !== "websocket" &&
          !isEventStream
        ),
        click: () => this.saveResponseAs(id, url, responseContent),
      },
      {
        type: "separator",
        visible: copySubMenu.slice(10, 14).some(subMenu => subMenu.visible),
      },
      {
        id: "request-list-context-resend-only",
        ...getMenuItemStrings("netmonitor-context-resend"),
        visible: !isCustom,
        click: () => {
          if (!newEditAndResendPref) {
            cloneRequest(id);
            sendCustomRequest();
          } else {
            sendHTTPCustomRequest(clickedRequest);
          }
        },
      },

      {
        id: "request-list-context-edit-resend",
        ...getMenuItemStrings("netmonitor-context-edit-and-resend"),
        visible: !isCustom,
        click: () => {
          this.fetchRequestHeaders(id).then(() => {
            if (!newEditAndResendPref) {
              cloneRequest(id);
              openDetailsPanelTab();
            } else {
              closeHTTPCustomRequestTab();
              openHTTPCustomRequestTab();
            }
          });
        },
      },
      // Request blocking
      {
        id: "request-list-context-block-url",
        ...getMenuItemStrings("netmonitor-context-block-url"),
        visible: !hasMatchingBlockingRequestPattern(
          blockedUrls,
          clickedRequest.url
        ),
        click: () => {
          openRequestBlockingAndAddUrl(clickedRequest.url);
        },
      },
      {
        id: "request-list-context-unblock-url",
        ...getMenuItemStrings("netmonitor-context-unblock-url"),
        visible: hasMatchingBlockingRequestPattern(
          blockedUrls,
          clickedRequest.url
        ),
        click: () => {
          if (
            blockedUrls.find(blockedUrl => blockedUrl === clickedRequest.url)
          ) {
            removeBlockedUrl(clickedRequest.url);
          } else {
            openRequestBlockingAndDisableUrls(clickedRequest.url);
          }
        },
      },
      // Request overrides
      {
        id: "request-list-context-set-override",
        ...getMenuItemStrings("netmonitor-context-set-override"),
        visible:
          // Network overrides are disabled for remote debugging (bug 1881441).
          isLocalTab &&
          !isOverridden &&
          (responseContentAvailable || responseContent),
        click: async () => {
          const content = await this.getResponseContent(id, responseContent);
          toolbox.store.dispatch(
            setNetworkOverride(toolbox.commands, url, content, window)
          );
        },
      },
      {
        id: "request-list-context-remove-override",
        ...getMenuItemStrings("netmonitor-context-remove-override"),
        // Network overrides are disabled for remote debugging (bug 1881441).
        visible: isLocalTab && isOverridden,
        click: () =>
          toolbox.store.dispatch(removeNetworkOverride(toolbox.commands, url)),
      },
      {
        type: "separator",
        visible: copySubMenu.slice(15, 16).some(subMenu => subMenu.visible),
      },
      {
        id: "request-list-context-newtab",
        ...getMenuItemStrings("netmonitor-context-new-tab"),
        visible: !!clickedRequest,
        click: () =>
          this.openRequestInTab(id, url, requestHeaders, requestPostData),
      },
      {
        id: "request-list-context-open-in-debugger",
        ...getMenuItemStrings("netmonitor-context-open-in-debugger"),
        visible: !!(
          clickedRequest &&
          mimeType &&
          mimeType.includes("javascript")
        ),
        click: () => this.openInDebugger(url),
      },
      {
        id: "request-list-context-open-in-style-editor",
        ...getMenuItemStrings("netmonitor-context-open-in-style-editor"),
        visible: !!(
          clickedRequest &&
          Services.prefs.getBoolPref("devtools.styleeditor.enabled") &&
          mimeType &&
          mimeType.includes("css")
        ),
        click: () => this.openInStyleEditor(url),
      },
      {
        id: "request-list-context-perf",
        ...getMenuItemStrings("netmonitor-context-perf-tools"),
        visible: !!requests.length,
        click: () => openStatistics(true),
      },
      {
        type: "separator",
      },
      {
        id: "request-list-context-use-as-fetch",
        ...getMenuItemStrings("netmonitor-context-use-as-fetch"),
        visible: !!clickedRequest,
        click: () =>
          this.useAsFetch(id, url, method, requestHeaders, requestPostData),
      },
    ];
  }

  /**
   * Opens selected item in a new tab.
   */
  async openRequestInTab(id, url, requestHeaders, requestPostData) {
    requestHeaders =
      requestHeaders ||
      (await this.props.connector.requestData(id, "requestHeaders"));

    requestPostData =
      requestPostData ||
      (await this.props.connector.requestData(id, "requestPostData"));

    openRequestInTab(url, requestHeaders, requestPostData);
  }

  open(event, clickedRequest, displayedRequests, blockedUrls) {
    const enabledBlockedUrls = blockedUrls
      .map(({ enabled, url }) => (enabled ? url : null))
      .filter(Boolean);

    const menu = this.createMenu(
      clickedRequest,
      displayedRequests,
      enabledBlockedUrls
    );

    showMenu(menu, {
      screenX: event.screenX,
      screenY: event.screenY,
      accesskeyConflictsBug: 2073896,
    });
  }

  /**
   * Opens selected item in the debugger
   */
  openInDebugger(url) {
    const toolbox = this.props.connector.getToolbox();
    toolbox.viewGeneratedSourceInDebugger(url);
  }

  /**
   * Opens selected item in the style editor
   */
  openInStyleEditor(url) {
    const toolbox = this.props.connector.getToolbox();
    toolbox.viewStyleGeneratedSource(url);
  }

  /**
   * Copy the request url from the currently selected item.
   */
  copyUrl(url) {
    copyString(url);
  }

  /**
   * Copy the request url query string parameters from the currently
   * selected item.
   */
  copyUrlParams(url) {
    const params = getUrlQuery(url).split("&");
    copyString(params.join(Services.appinfo.OS === "WINNT" ? "\r\n" : "\n"));
  }

  /**
   * Copy the request form data parameters (or raw payload) from
   * the currently selected item.
   */
  async copyPostData(id, formDataSections, requestPostData) {
    let params = [];
    // Try to extract any form data parameters if formDataSections is already
    // available, which is only true if RequestPanel has ever been mounted before.
    if (formDataSections) {
      formDataSections.forEach(section => {
        const paramsArray = parseQueryString(section);
        if (paramsArray) {
          params = [...params, ...paramsArray];
        }
      });
    }

    let string = params
      .map(param => param.name + (param.value ? "=" + param.value : ""))
      .join(Services.appinfo.OS === "WINNT" ? "\r\n" : "\n");

    // Fall back to raw payload.
    if (!string) {
      requestPostData =
        requestPostData ||
        (await this.props.connector.requestData(id, "requestPostData"));

      string = requestPostData.postData.text;
      if (Services.appinfo.OS !== "WINNT") {
        string = string.replace(/\r/g, "");
      }
    }
    copyString(string);
  }

  /**
   * Copy a cURL command from the currently selected item.
   */
  async copyAsCurl(
    id,
    url,
    method,
    httpVersion,
    requestHeaders,
    requestPostData,
    responseHeaders,
    platform
  ) {
    requestHeaders =
      requestHeaders ||
      (await this.props.connector.requestData(id, "requestHeaders"));

    requestPostData =
      requestPostData ||
      (await this.props.connector.requestData(id, "requestPostData"));

    responseHeaders =
      responseHeaders ||
      (await this.props.connector.requestData(id, "responseHeaders"));

    // Create a sanitized object for the Curl command generator.
    const data = {
      url,
      method,
      headers: requestHeaders.headers,
      responseHeaders: responseHeaders.headers,
      httpVersion,
      postDataText: requestPostData ? requestPostData.postData.text : "",
    };
    copyString(Curl.generateCommand(data, platform));
  }

  async copyAsPowerShell(request) {
    let { id, url, method, requestHeaders, requestPostData, requestCookies } =
      request;

    requestHeaders =
      requestHeaders ||
      (await this.props.connector.requestData(id, "requestHeaders"));

    requestPostData =
      requestPostData ||
      (await this.props.connector.requestData(id, "requestPostData"));

    requestCookies =
      requestCookies ||
      (await this.props.connector.requestData(id, "requestCookies"));

    return copyString(
      PowerShell.generateCommand(
        url,
        method,
        requestHeaders.headers,
        requestPostData.postData,
        requestCookies.cookies || requestCookies
      )
    );
  }

  /**
   * Generate fetch string
   */
  async generateFetchString(id, url, method, requestHeaders, requestPostData) {
    requestHeaders =
      requestHeaders ||
      (await this.props.connector.requestData(id, "requestHeaders"));

    requestPostData =
      requestPostData ||
      (await this.props.connector.requestData(id, "requestPostData"));

    // https://fetch.spec.whatwg.org/#forbidden-header-name
    const forbiddenHeaders = {
      "accept-charset": 1,
      "accept-encoding": 1,
      "access-control-request-headers": 1,
      "access-control-request-method": 1,
      connection: 1,
      "content-length": 1,
      cookie: 1,
      cookie2: 1,
      date: 1,
      dnt: 1,
      expect: 1,
      host: 1,
      "keep-alive": 1,
      origin: 1,
      referer: 1,
      te: 1,
      trailer: 1,
      "transfer-encoding": 1,
      upgrade: 1,
      via: 1,
    };
    const credentialHeaders = { cookie: 1, authorization: 1 };

    const headers = {};
    for (const { name, value } of requestHeaders.headers) {
      if (!forbiddenHeaders[name.toLowerCase()]) {
        headers[name] = value;
      }
    }

    const referrerHeader = requestHeaders.headers.find(
      ({ name }) => name.toLowerCase() === "referer"
    );

    const credentials = requestHeaders.headers.some(
      ({ name }) => credentialHeaders[name.toLowerCase()]
    )
      ? "include"
      : "omit";

    const fetchOptions = {
      credentials,
      headers,
      referrer: referrerHeader?.value,
      body: requestPostData.postData.text,
      method,
      mode: "cors",
    };

    const options = JSON.stringify(fetchOptions, null, 4);
    const fetchString = `await fetch(${JSON.stringify(url)}, ${options});`;
    return fetchString;
  }

  /**
   * Copy the currently selected item as fetch request.
   */
  async copyAsFetch(id, url, method, requestHeaders, requestPostData) {
    const fetchString = await this.generateFetchString(
      id,
      url,
      method,
      requestHeaders,
      requestPostData
    );
    copyString(fetchString);
  }

  /**
   * Open split console and fill it with fetch command for selected item
   */
  async useAsFetch(id, url, method, requestHeaders, requestPostData) {
    const fetchString = await this.generateFetchString(
      id,
      url,
      method,
      requestHeaders,
      requestPostData
    );
    const toolbox = this.props.connector.getToolbox();
    await toolbox.openSplitConsole();
    const { hud } = await toolbox.getPanel("webconsole");
    hud.setInputValue(fetchString);
  }

  /**
   * Copy the raw request headers from the currently selected item.
   */
  async copyRequestHeaders(
    id,
    { method, httpVersion, requestHeaders, urlDetails }
  ) {
    requestHeaders =
      requestHeaders ||
      (await this.props.connector.requestData(id, "requestHeaders"));

    let rawHeaders = getRequestHeadersRawText(
      method,
      httpVersion,
      requestHeaders,
      urlDetails
    );

    if (Services.appinfo.OS !== "WINNT") {
      rawHeaders = rawHeaders.replace(/\r/g, "");
    }
    copyString(rawHeaders);
  }

  /**
   * Copy the raw response headers from the currently selected item.
   */
  async copyResponseHeaders(id, responseHeaders) {
    responseHeaders =
      responseHeaders ||
      (await this.props.connector.requestData(id, "responseHeaders"));

    let rawHeaders = responseHeaders.rawHeaders.trim();

    if (Services.appinfo.OS !== "WINNT") {
      rawHeaders = rawHeaders.replace(/\r/g, "");
    }
    copyString(rawHeaders);
  }

  /**
   * Copy image as data uri.
   */
  async copyImageAsDataUri(id, mimeType, responseContent) {
    responseContent =
      responseContent ||
      (await this.props.connector.requestData(id, "responseContent"));

    const { encoding, text } = responseContent.content;
    copyString(formDataURI(mimeType, encoding, text));
  }

  async getResponseContent(id, responseContent) {
    responseContent =
      responseContent ||
      (await this.props.connector.requestData(id, "responseContent"));

    const { encoding, text } = responseContent.content;
    let data;
    if (encoding === "base64") {
      const decoded = atob(text);
      data = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; ++i) {
        data[i] = decoded.charCodeAt(i);
      }
    } else {
      data = new TextEncoder().encode(text);
    }
    return data;
  }

  /**
   * Save response as.
   */
  async saveResponseAs(id, url, responseContent) {
    const fileName = getUrlBaseName(url);
    const content = await this.getResponseContent(id, responseContent);
    saveAs(window, content, fileName);
  }

  /**
   * Copy response data as a string.
   */
  async copyResponse(id, responseContent) {
    responseContent =
      responseContent ||
      (await this.props.connector.requestData(id, "responseContent"));

    copyString(responseContent.content.text);
  }

  async fetchRequestHeaders(id) {
    await this.props.connector.requestData(id, "requestHeaders");
  }
}

module.exports = RequestListContextMenu;
