# Any copyright is dedicated to the Public Domain.
# http://creativecommons.org/publicdomain/zero/1.0/

import fluent.syntax.ast as FTL
from fluent.migrate.helpers import VARIABLE_REFERENCE, transforms_from
from fluent.migrate.transforms import COPY, PLURALS, REPLACE, REPLACE_IN_TEXT


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
