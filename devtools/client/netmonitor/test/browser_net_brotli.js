/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const BROTLI_URL = HTTPS_EXAMPLE_URL + "html_brotli-test-page.html";
const BROTLI_REQUESTS = 1;

/**
 * Test brotli encoded response is handled correctly on HTTPS.
 */

const l10n = new Localization(["devtools/client/netmonitor.ftl"], true);

add_task(async function () {
  const { tab, monitor } = await initNetMonitor(BROTLI_URL, {
    requestCount: 1,
  });
  info("Starting test... ");

  const { document, store, windowRequire } = monitor.panelWin;
  const Actions = windowRequire("devtools/client/netmonitor/src/actions/index");
  const { getDisplayedRequests, getSortedRequests } = windowRequire(
    "devtools/client/netmonitor/src/selectors/index"
  );

  store.dispatch(Actions.batchEnable(false));

  // Execute requests.
  await performRequests(monitor, tab, BROTLI_REQUESTS);

  const requestItem = document.querySelector(".request-list-item");
  // Status code title is generated on hover
  const requestsListStatus = requestItem.querySelector(".status-code");
  EventUtils.sendMouseEvent({ type: "mouseover" }, requestsListStatus);
  await waitUntil(() => requestsListStatus.title);
  await waitForDOM(requestItem, ".requests-list-timings-total");

  await verifyRequestItemTarget(
    document,
    getDisplayedRequests(store.getState()),
    getSortedRequests(store.getState())[0],
    "GET",
    HTTPS_CONTENT_TYPE_SJS + "?fmt=br",
    {
      status: 200,
      statusText: "OK",
      type: "json",
      fullMimeType: "text/json",
      transferred: l10n.formatValueSync("network-menu-size-b", { size: 252 }),
      size: l10n.formatValueSync("network-menu-size-b", { size: 64 }),
      time: true,
    }
  );

  const onDomUpdated = waitForDOM(document, ".cm-content");
  const onResponseContent = monitor.panelWin.api.once(
    TEST_EVENTS.RECEIVED_RESPONSE_CONTENT
  );
  store.dispatch(Actions.toggleNetworkDetails());
  clickOnSidebarTab(document, "response");
  await onDomUpdated;
  await onResponseContent;
  await testResponse("br");
  await teardown(monitor);

  function testResponse(type) {
    switch (type) {
      case "br": {
        is(
          getCodeMirrorValue(monitor),
          "X".repeat(64),
          "The text shown in the source editor is incorrect for the brotli request."
        );
        break;
      }
    }
  }
});
