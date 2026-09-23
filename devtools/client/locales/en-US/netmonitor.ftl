# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

## Strings used in the status bar of the DevTools Network Panel

# Tooltip for the performance button in the status bar
network-menu-summary-tooltip-perf =
    .title = Start performance analysis
network-menu-summary-tooltip-domcontentloaded =
    .title = Time when “DOMContentLoaded” event occurred
network-menu-summary-tooltip-load =
    .title = Time when “load” event occurred
# This label is displayed in the network table footer providing the
# number of requests
# Variables:
#   $requestCount (Number): The total number of requests.
network-menu-summary-requests-count =
    { $requestCount ->
        [0] No requests
        [one] { $requestCount } request
        *[other] { $requestCount } requests
    }
network-menu-summary-tooltip-requests-count =
    .title = Number of requests
# This label is displayed in the network table footer providing the
# transferred size.
# Variables:
#   $formattedContentSize (String): The formatted content size.
#   $formattedTransferredSize (String): The formatted transferred size.
network-menu-summary-transferred =
    { $formattedContentSize } / { $formattedTransferredSize } transferred
network-menu-summary-tooltip-transferred =
    .title = Size/transferred size of all requests
# This label is displayed in the network table footer providing the
# transfer time.
# Variables:
#   $formattedTime (String): The formatted transfer time.
network-menu-summary-finish = Finish: { $formattedTime }
network-menu-summary-tooltip-finish =
    .title = Total time needed to load all requests

## Strings used in the search panel of the DevTools Network Panel

# This is the label displayed in the search toolbar for the search input as the
# placeholder.
netmonitor-search-toolbar-input-placeholder = Find in resources…
# This is the tooltip of the search toolbar button that clears the search panel.
netmonitor-search-toolbar-clear =
    .title = Clear Search Results
# This is the tooltip of the search toolbar button that toggles a case
# sensitive search.
netmonitor-search-toolbar-case-sensitive =
    .title = Case Sensitive
# This is the label displayed in the search results status bar when status is
# set to fetching.
netmonitor-search-status-labels-fetching = Searching…
# This is the label displayed in the search results status bar when status is
# set to cancelled.
netmonitor-search-status-labels-canceled = Search canceled.
# This is the label displayed in the search results status bar when status is
# set to done.
# Variables:
#   $matchingLines (String): the matching lines found, already formatted by
#     netmonitor-search-status-labels-matching-lines.
#   $matchingFiles (String): the files the matching lines were found in, already
#     formatted by netmonitor-search-status-labels-file-count.
netmonitor-search-status-labels-done = Search finished. { $matchingLines } { $matchingFiles }.
# This is the label displayed in the search results status bar showing matching
# lines found.
# Variables:
#   $lines (Number): the number of matching lines found.
netmonitor-search-status-labels-matching-lines =
    { $lines ->
        [one] Found { $lines } matching line
       *[other] Found { $lines } matching lines
    }
# This is the label displayed in the search results status bar showing the
# number of files the matching lines were found in.
# Variables:
#   $files (Number): the number of files in which matching lines were found.
netmonitor-search-status-labels-file-count =
    { $files ->
        [one] in { $files } file
       *[other] in { $files } files
    }
# This is the label displayed in the search results status bar when status is
# set to error.
netmonitor-search-status-labels-error = Search error.
