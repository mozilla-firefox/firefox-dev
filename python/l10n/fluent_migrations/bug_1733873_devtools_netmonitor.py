# Any copyright is dedicated to the Public Domain.
# http://creativecommons.org/publicdomain/zero/1.0/

import fluent.syntax.ast as FTL
from fluent.migrate.helpers import (
    MESSAGE_REFERENCE,
    VARIABLE_REFERENCE,
    transforms_from,
)
from fluent.migrate.transforms import COPY, PLURALS, REPLACE, REPLACE_IN_TEXT


# based on bug 1953339, itself based on bug 1832141
class CUSTOM_PLURALS(PLURALS):
    def __call__(self, ctx):
        pattern = super().__call__(ctx)
        el = pattern.elements[0]
        if isinstance(el, FTL.Placeable) and isinstance(
            el.expression, FTL.SelectExpression
        ):
            pass
        else:
            selexp = FTL.SelectExpression(
                VARIABLE_REFERENCE("messageCount"),
                [FTL.Variant(FTL.Identifier("other"), pattern, default=True)],
            )
            pattern = FTL.Pattern([FTL.Placeable(selexp)])
            el = pattern.elements[0]
        el.expression.variants[0:0] = [
            FTL.Variant(
                FTL.NumberLiteral("0"),
                COPY(self.path, "networkMenu.ws.summary.framesCountEmpty")(ctx),
            )
        ]
        return pattern


def migrate(ctx):
    """Bug 1733873 - Migrate netmonitor.properties to Fluent, part {index}."""

    source = "devtools/client/netmonitor.properties"
    target = "devtools/client/netmonitor.ftl"

    ctx.add_transforms(
        target,
        target,
        [
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-toolbar-input-placeholder"),
                value=COPY(source, "netmonitor.search.toolbar.inputPlaceholder"),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-toolbar-clear"),
                attributes=[
                    FTL.Attribute(
                        id=FTL.Identifier("title"),
                        value=COPY(source, "netmonitor.search.toolbar.clear"),
                    )
                ],
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-toolbar-case-sensitive"),
                attributes=[
                    FTL.Attribute(
                        id=FTL.Identifier("title"),
                        value=COPY(source, "netmonitor.search.toolbar.caseSensitive"),
                    )
                ],
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-status-labels-fetching"),
                value=COPY(source, "netmonitor.search.status.labels.fetching"),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-status-labels-canceled"),
                value=COPY(source, "netmonitor.search.status.labels.canceled"),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-status-labels-done"),
                value=REPLACE(
                    source,
                    "netmonitor.search.status.labels.done",
                    {
                        "%1$S": VARIABLE_REFERENCE("matchingLines"),
                        "%2$S": VARIABLE_REFERENCE("matchingFiles"),
                    },
                ),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-status-labels-matching-lines"),
                value=PLURALS(
                    source,
                    "netmonitor.search.status.labels.matchingLines",
                    VARIABLE_REFERENCE("lines"),
                    lambda text: REPLACE_IN_TEXT(
                        text, {"#1": VARIABLE_REFERENCE("lines")}
                    ),
                ),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-status-labels-file-count"),
                value=PLURALS(
                    source,
                    "netmonitor.search.status.labels.fileCount",
                    VARIABLE_REFERENCE("files"),
                    lambda text: REPLACE_IN_TEXT(
                        text, {"#1": VARIABLE_REFERENCE("files")}
                    ),
                ),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-search-status-labels-error"),
                value=COPY(source, "netmonitor.search.status.labels.error"),
            ),
        ],
    )

    ctx.add_transforms(
        target,
        target,
        transforms_from(
            """
netmonitor-toolbar-status = { COPY(from_path, "netmonitor.toolbar.status3") }
netmonitor-toolbar-method = { COPY(from_path, "netmonitor.toolbar.method") }
netmonitor-toolbar-override = { COPY(from_path, "netmonitor.toolbar.override") }
netmonitor-toolbar-priority = { COPY(from_path, "netmonitor.toolbar.priority") }
netmonitor-toolbar-file = { COPY(from_path, "netmonitor.toolbar.file") }
netmonitor-toolbar-path = { COPY(from_path, "netmonitor.toolbar.path") }
netmonitor-toolbar-url = { COPY(from_path, "netmonitor.toolbar.url") }
netmonitor-toolbar-protocol = { COPY(from_path, "netmonitor.toolbar.protocol") }
netmonitor-toolbar-domain = { COPY(from_path, "netmonitor.toolbar.domain") }
netmonitor-toolbar-remoteip = { COPY(from_path, "netmonitor.toolbar.remoteip") }
netmonitor-toolbar-initiator = { COPY(from_path, "netmonitor.toolbar.initiator") }
netmonitor-toolbar-type = { COPY(from_path, "netmonitor.toolbar.type") }
netmonitor-toolbar-cookies = { COPY(from_path, "netmonitor.toolbar.cookies") }
netmonitor-toolbar-set-cookies = { COPY(from_path, "netmonitor.toolbar.setCookies") }
netmonitor-toolbar-scheme = { COPY(from_path, "netmonitor.toolbar.scheme") }
netmonitor-toolbar-start-time = { COPY(from_path, "netmonitor.toolbar.startTime") }
netmonitor-toolbar-end-time = { COPY(from_path, "netmonitor.toolbar.endTime") }
netmonitor-toolbar-response-time = { COPY(from_path, "netmonitor.toolbar.responseTime") }
netmonitor-toolbar-duration = { COPY(from_path, "netmonitor.toolbar.duration") }
netmonitor-toolbar-latency = { COPY(from_path, "netmonitor.toolbar.latency") }
netmonitor-toolbar-transferred = { COPY(from_path, "netmonitor.toolbar.transferred") }
netmonitor-toolbar-content-size = { COPY(from_path, "netmonitor.toolbar.contentSize") }
netmonitor-toolbar-waterfall = { COPY(from_path, "netmonitor.toolbar.waterfall") }
netmonitor-toolbar-request-blocking =
    .title = { COPY(from_path, "netmonitor.toolbar.requestBlocking") }
netmonitor-toolbar-filter-all = { COPY(from_path, "netmonitor.toolbar.filter.all") }
netmonitor-toolbar-filter-html = { COPY(from_path, "netmonitor.toolbar.filter.html") }
netmonitor-toolbar-filter-css = { COPY(from_path, "netmonitor.toolbar.filter.css") }
netmonitor-toolbar-filter-js = { COPY(from_path, "netmonitor.toolbar.filter.js") }
netmonitor-toolbar-filter-xhr = { COPY(from_path, "netmonitor.toolbar.filter.xhr") }
netmonitor-toolbar-filter-fonts = { COPY(from_path, "netmonitor.toolbar.filter.fonts") }
netmonitor-toolbar-filter-images = { COPY(from_path, "netmonitor.toolbar.filter.images") }
netmonitor-toolbar-filter-media = { COPY(from_path, "netmonitor.toolbar.filter.media") }
netmonitor-toolbar-filter-ws = { COPY(from_path, "netmonitor.toolbar.filter.ws") }
netmonitor-toolbar-filter-other = { COPY(from_path, "netmonitor.toolbar.filter.other") }
netmonitor-toolbar-filter-freetext-label = { COPY(from_path, "netmonitor.toolbar.filterFreetext.label") }
netmonitor-toolbar-filter-freetext-key = { COPY(from_path, "netmonitor.toolbar.filterFreetext.key") }
netmonitor-toolbar-search-key = { COPY(from_path, "netmonitor.toolbar.search.key") }
netmonitor-toolbar-copy-key = { COPY(from_path, "netmonitor.toolbar.copy.key") }
netmonitor-toolbar-filter-freetext-learn-more = { COPY(from_path, "netmonitor.toolbar.filterFreetext.learnMore") }
netmonitor-toolbar-enable-persistent-logs-label = { COPY(from_path, "netmonitor.toolbar.enablePersistentLogs.label") }
netmonitor-toolbar-enable-persistent-logs-tooltip = { COPY(from_path, "netmonitor.toolbar.enablePersistentLogs.tooltip") }
netmonitor-toolbar-disable-cache-label = { COPY(from_path, "netmonitor.toolbar.disableCache.label") }
netmonitor-toolbar-disable-cache-tooltip =
    .title = { COPY(from_path, "netmonitor.toolbar.disableCache.tooltip") }
netmonitor-toolbar-clear =
    .title = { COPY(from_path, "netmonitor.toolbar.clear") }
netmonitor-toolbar-toggle-recording =
    .title = { COPY(from_path, "netmonitor.toolbar.toggleRecording") }
netmonitor-toolbar-search =
    .title = { COPY(from_path, "netmonitor.toolbar.search") }
netmonitor-toolbar-http-custom-request =
    .title = { COPY(from_path, "netmonitor.toolbar.HTTPCustomRequest") }
netmonitor-toolbar-reset-columns = { COPY(from_path, "netmonitor.toolbar.resetColumns") }
netmonitor-toolbar-reset-sorting = { COPY(from_path, "netmonitor.toolbar.resetSorting") }
netmonitor-toolbar-resize-column-to-fit-content = { COPY(from_path, "netmonitor.toolbar.resizeColumnToFitContent") }
netmonitor-toolbar-resize-column-to-fit-content-title =
    .title = { COPY(from_path, "netmonitor.toolbar.resizeColumnToFitContent.title") }
netmonitor-toolbar-timings = { COPY(from_path, "netmonitor.toolbar.timings") }
netmonitor-toolbar-response-headers = { COPY(from_path, "netmonitor.toolbar.responseHeaders") }
""",
            from_path=source,
        ),
    )

    ctx.add_transforms(
        target,
        target,
        transforms_from(
            """
netmonitor-context-copy-value =
    .label = { COPY(from_path, "netmonitor.context.copyValue") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyValue.accesskey") }
netmonitor-context-copy-all =
    .label = { COPY(from_path, "netmonitor.context.copyAll") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyAll.accesskey") }
netmonitor-context-copy-url =
    .label = { COPY(from_path, "netmonitor.context.copyUrl") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyUrl.accesskey") }
netmonitor-context-copy-url-params =
    .label = { COPY(from_path, "netmonitor.context.copyUrlParams") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyUrlParams.accesskey") }
netmonitor-context-copy-as-powershell =
    .label = { COPY(from_path, "netmonitor.context.copyAsPowerShell") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyAsPowerShell.accesskey") }
netmonitor-context-copy-as-curl =
    .label = { COPY(from_path, "netmonitor.context.copyAsCurl") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyAsCurl.accesskey") }
netmonitor-context-copy-as-fetch =
    .label = { COPY(from_path, "netmonitor.context.copyAsFetch") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyAsFetch.accesskey") }
netmonitor-context-copy-request-headers =
    .label = { COPY(from_path, "netmonitor.context.copyRequestHeaders") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyRequestHeaders.accesskey") }
netmonitor-context-copy-response-headers =
    .label = { COPY(from_path, "netmonitor.context.copyResponseHeaders") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyResponseHeaders.accesskey") }
netmonitor-context-copy-response =
    .label = { COPY(from_path, "netmonitor.context.copyResponse") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyResponse.accesskey") }
netmonitor-context-copy-image-as-data-uri =
    .label = { COPY(from_path, "netmonitor.context.copyImageAsDataUri") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyImageAsDataUri.accesskey") }
netmonitor-context-set-override =
    .label = { COPY(from_path, "netmonitor.context.setOverride") }
    .accesskey = { COPY(from_path, "netmonitor.context.setOverride.accesskey") }
netmonitor-context-remove-override =
    .label = { COPY(from_path, "netmonitor.context.removeOverride") }
    .accesskey = { COPY(from_path, "netmonitor.context.removeOverride.accesskey") }
netmonitor-context-use-as-fetch =
    .label = { COPY(from_path, "netmonitor.context.useAsFetch") }
    .accesskey = { COPY(from_path, "netmonitor.context.useAsFetch.accesskey") }
netmonitor-context-save-response-as =
    .label = { COPY(from_path, "netmonitor.context.saveResponseAs") }
    .accesskey = { COPY(from_path, "netmonitor.context.saveResponseAs.accesskey") }
netmonitor-context-copy-all-as-har =
    .label = { COPY(from_path, "netmonitor.context.copyAllAsHar") }
    .accesskey = { COPY(from_path, "netmonitor.context.copyAllAsHar.accesskey") }
netmonitor-context-save-as-har =
    .label = { COPY(from_path, "netmonitor.context.saveAsHar") }
    .accesskey = { COPY(from_path, "netmonitor.context.saveAsHar.accesskey") }
netmonitor-context-save-all-as-har =
    .label = { COPY(from_path, "netmonitor.context.saveAllAsHar") }
    .accesskey = { COPY(from_path, "netmonitor.context.saveAllAsHar.accesskey") }
netmonitor-context-import-har =
    .label = { COPY(from_path, "netmonitor.har.importHarDialogTitle") }
    .accesskey = { COPY(from_path, "netmonitor.context.importHar.accesskey") }
netmonitor-context-hint-request-not-available =
    .label = { COPY(from_path, "netmonitor.context.hintRequestNotAvailable") }
netmonitor-context-resend =
    .label = { COPY(from_path, "netmonitor.context.resend.label") }
    .accesskey = { COPY(from_path, "netmonitor.context.resend.accesskey") }
netmonitor-context-edit-and-resend =
    .label = { COPY(from_path, "netmonitor.context.editAndResend") }
    .accesskey = { COPY(from_path, "netmonitor.context.editAndResend.accesskey") }
netmonitor-context-block-url =
    .label = { COPY(from_path, "netmonitor.context.blockURL") }
netmonitor-context-unblock-url =
    .label = { COPY(from_path, "netmonitor.context.unblockURL") }
netmonitor-context-new-tab =
    .label = { COPY(from_path, "netmonitor.context.newTab") }
    .accesskey = { COPY(from_path, "netmonitor.context.newTab.accesskey") }
netmonitor-context-open-in-debugger =
    .label = { COPY(from_path, "netmonitor.context.openInDebugger") }
    .accesskey = { COPY(from_path, "netmonitor.context.openInDebugger.accesskey") }
netmonitor-context-open-in-style-editor =
    .label = { COPY(from_path, "netmonitor.context.openInStyleEditor") }
    .accesskey = { COPY(from_path, "netmonitor.context.openInStyleEditor.accesskey") }
netmonitor-context-perf-tools =
    .label = { COPY(from_path, "netmonitor.context.perfTools") }
    .accesskey = { COPY(from_path, "netmonitor.context.perfTools.accesskey") }
netmonitor-request-blocking-menu-enable-all-blocked-urls = { COPY(from_path, "netmonitor.requestBlockingMenu.enableAllBlockedUrls") }
netmonitor-request-blocking-menu-disable-all-blocked-urls = { COPY(from_path, "netmonitor.requestBlockingMenu.disableAllBlockedUrls") }
netmonitor-request-blocking-menu-remove-all-blocked-urls = { COPY(from_path, "netmonitor.requestBlockingMenu.removeAllBlockedUrls") }
netmonitor-har-import-har-dialog-title = { COPY(from_path, "netmonitor.har.importHarDialogTitle") }
netmonitor-har-import-dialog-har-filter = { COPY(from_path, "netmonitor.har.importDialogHARFilter") }
netmonitor-har-import-dialog-all-filter = { COPY(from_path, "netmonitor.har.importDialogAllFilter") }
""",
            from_path=source,
        )
        + [
            FTL.Message(
                id=FTL.Identifier("netmonitor-context-copy-request-data"),
                attributes=[
                    FTL.Attribute(
                        id=FTL.Identifier("label"),
                        value=REPLACE(
                            source,
                            "netmonitor.context.copyRequestData",
                            {"%1$S": VARIABLE_REFERENCE("method")},
                        ),
                    ),
                    FTL.Attribute(
                        id=FTL.Identifier("accesskey"),
                        value=COPY(
                            source, "netmonitor.context.copyRequestData.accesskey"
                        ),
                    ),
                ],
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-context-copy-as-curl-win"),
                attributes=[
                    FTL.Attribute(
                        id=FTL.Identifier("label"),
                        value=REPLACE(
                            source,
                            "netmonitor.context.copyAsCurl.win",
                            {
                                "%1$S": MESSAGE_REFERENCE(
                                    "netmonitor-context-copy-as-curl.label"
                                )
                            },
                        ),
                    ),
                    FTL.Attribute(
                        id=FTL.Identifier("accesskey"),
                        value=COPY(
                            source, "netmonitor.context.copyAsCurl.win.accesskey"
                        ),
                    ),
                ],
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-context-copy-as-curl-posix"),
                attributes=[
                    FTL.Attribute(
                        id=FTL.Identifier("label"),
                        value=REPLACE(
                            source,
                            "netmonitor.context.copyAsCurl.posix",
                            {
                                "%1$S": MESSAGE_REFERENCE(
                                    "netmonitor-context-copy-as-curl.label"
                                )
                            },
                        ),
                    ),
                    FTL.Attribute(
                        id=FTL.Identifier("accesskey"),
                        value=COPY(
                            source, "netmonitor.context.copyAsCurl.posix.accesskey"
                        ),
                    ),
                ],
            ),
        ],
    )

    ctx.add_transforms(
        target,
        target,
        transforms_from(
            """
netmonitor-ws-toolbar-data = { COPY(from_path, "netmonitor.ws.toolbar.data") }
netmonitor-ws-toolbar-size = { COPY(from_path, "netmonitor.ws.toolbar.size") }
netmonitor-ws-toolbar-op-code = { COPY(from_path, "netmonitor.ws.toolbar.opCode") }
netmonitor-ws-toolbar-mask-bit = { COPY(from_path, "netmonitor.ws.toolbar.maskBit") }
netmonitor-ws-toolbar-fin-bit = { COPY(from_path, "netmonitor.ws.toolbar.finBit") }
netmonitor-ws-toolbar-time = { COPY(from_path, "netmonitor.ws.toolbar.time") }
netmonitor-ws-toolbar-event-name = { COPY(from_path, "netmonitor.ws.toolbar.eventName") }
netmonitor-ws-toolbar-last-event-id = { COPY(from_path, "netmonitor.ws.toolbar.lastEventId") }
netmonitor-ws-toolbar-retry = { COPY(from_path, "netmonitor.ws.toolbar.retry") }
netmonitor-ws-toolbar-clear =
    .title = { COPY(from_path, "netmonitor.ws.toolbar.clear") }
netmonitor-ws-toolbar-filter-freetext-label = { COPY(from_path, "netmonitor.ws.toolbar.filterFreetext.label") }
netmonitor-ws-toolbar-filter-freetext-key = { COPY(from_path, "netmonitor.ws.toolbar.filterFreetext.key") }
netmonitor-ws-toolbar-reset-columns = { COPY(from_path, "netmonitor.ws.toolbar.resetColumns") }
netmonitor-ws-connection-closed = { COPY(from_path, "netmonitor.ws.connection.closed") }
netmonitor-ws-type-sent = { COPY(from_path, "netmonitor.ws.type.sent") }
netmonitor-ws-type-received = { COPY(from_path, "netmonitor.ws.type.received") }
netmonitor-ws-context-all =
    .label = { COPY(from_path, "netmonitor.ws.context.all") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.all.accesskey") }
netmonitor-ws-context-sent =
    .label = { COPY(from_path, "netmonitor.ws.context.sent") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.sent.accesskey") }
netmonitor-ws-context-received =
    .label = { COPY(from_path, "netmonitor.ws.context.received") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.received.accesskey") }
netmonitor-ws-context-control-frames =
    .label = { COPY(from_path, "netmonitor.ws.context.controlFrames") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.controlFrames.accesskey") }
netmonitor-ws-context-copy-frame =
    .label = { COPY(from_path, "netmonitor.ws.context.copyFrame") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.copyFrame.accesskey") }
netmonitor-ws-context-copy-frame-as-base64 =
    .label = { COPY(from_path, "netmonitor.ws.context.copyFrameAsBase64") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.copyFrameAsBase64.accesskey") }
netmonitor-ws-context-copy-frame-as-hex =
    .label = { COPY(from_path, "netmonitor.ws.context.copyFrameAsHex") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.copyFrameAsHex.accesskey") }
netmonitor-ws-context-copy-frame-as-text =
    .label = { COPY(from_path, "netmonitor.ws.context.copyFrameAsText") }
    .accesskey = { COPY(from_path, "netmonitor.ws.context.copyFrameAsText.accesskey") }
network-menu-ws-summary-tooltip-messages-count =
    .title = { COPY(from_path, "networkMenu.ws.summary.tooltip.framesCount") }
network-menu-ws-summary-tooltip-messages-total-size =
    .title = { COPY(from_path, "networkMenu.ws.summary.tooltip.framesTotalSize") }
network-menu-ws-summary-tooltip-messages-total-time =
    .title = { COPY(from_path, "networkMenu.ws.summary.tooltip.framesTotalTime") }
""",
            from_path=source,
        )
        + [
            FTL.Message(
                id=FTL.Identifier("netmonitor-ws-raw-data-header"),
                value=REPLACE(
                    source,
                    "netmonitor.ws.rawData.header",
                    {"%1$S": VARIABLE_REFERENCE("formattedSize")},
                ),
            ),
            FTL.Message(
                id=FTL.Identifier("netmonitor-ws-truncated-messages-warning"),
                value=PLURALS(
                    source,
                    "netmonitor.ws.truncated-messages.warning",
                    VARIABLE_REFERENCE("messageCount"),
                    lambda text: REPLACE_IN_TEXT(
                        text, {"#1": VARIABLE_REFERENCE("messageCount")}
                    ),
                ),
            ),
            FTL.Message(
                id=FTL.Identifier("network-menu-ws-summary-messages-count"),
                value=CUSTOM_PLURALS(
                    source,
                    "networkMenu.ws.summary.framesCount2",
                    VARIABLE_REFERENCE("messageCount"),
                    lambda text: REPLACE_IN_TEXT(
                        text, {"#1": VARIABLE_REFERENCE("messageCount")}
                    ),
                ),
            ),
            FTL.Message(
                id=FTL.Identifier("network-menu-ws-summary-messages-transferred-size"),
                value=REPLACE(
                    source,
                    "networkMenu.ws.summary.label.framesTranferredSize",
                    {
                        "%1$S": VARIABLE_REFERENCE("formattedTotalSize"),
                        "%2$S": VARIABLE_REFERENCE("formattedSentSize"),
                        "%3$S": VARIABLE_REFERENCE("formattedReceivedSize"),
                    },
                ),
            ),
        ],
    )
