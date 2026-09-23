# Any copyright is dedicated to the Public Domain.
# http://creativecommons.org/publicdomain/zero/1.0/

import fluent.syntax.ast as FTL
from fluent.migrate.helpers import VARIABLE_REFERENCE
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
