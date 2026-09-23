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

## Labels for the columns of the DevTools Network Panel request table. Each is
## displayed in the table header, and in the header context menu that toggles
## the column's visibility.

netmonitor-toolbar-status = Status
netmonitor-toolbar-method = Method
netmonitor-toolbar-override = Override
netmonitor-toolbar-priority = Priority
netmonitor-toolbar-file = File
netmonitor-toolbar-path = Path
netmonitor-toolbar-url = URL
netmonitor-toolbar-protocol = Protocol
netmonitor-toolbar-domain = Domain
netmonitor-toolbar-remoteip = Remote IP
netmonitor-toolbar-initiator = Initiator
netmonitor-toolbar-type = Type
netmonitor-toolbar-cookies = Cookies
# Set-Cookie is a HTTP response header. This string is the plural form of it.
# See https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie
netmonitor-toolbar-set-cookies = Set-Cookies
netmonitor-toolbar-scheme = Scheme
# The time from the start of the 1st request until the start of this request.
netmonitor-toolbar-start-time = Start Time
# The time from the start of the 1st request until the end of this response.
netmonitor-toolbar-end-time = End Time
# The time from the start of the 1st request until the beginning of download of
# this response.
netmonitor-toolbar-response-time = Response Time
# The time from the start of this request until the end of this response.
netmonitor-toolbar-duration = Duration
# The time from the end of this request until the beginning of download of this
# response.
netmonitor-toolbar-latency = Latency
# The compressed / encoded size. Also displayed in the general section of the
# headers panel.
netmonitor-toolbar-transferred = Transferred
# The uncompressed / decoded size.
netmonitor-toolbar-content-size = Size
netmonitor-toolbar-waterfall = Timeline

## Strings used in the toolbar of the DevTools Network Panel

# This is the tooltip displayed over the toolbar's Request Blocking button.
netmonitor-toolbar-request-blocking =
    .title = Request Blocking
# The following are the labels displayed in the network toolbar for the
# request type filtering buttons.
netmonitor-toolbar-filter-all = All
netmonitor-toolbar-filter-html = HTML
netmonitor-toolbar-filter-css = CSS
netmonitor-toolbar-filter-js = JS
netmonitor-toolbar-filter-xhr = XHR
netmonitor-toolbar-filter-fonts = Fonts
netmonitor-toolbar-filter-images = Images
netmonitor-toolbar-filter-media = Media
netmonitor-toolbar-filter-ws = WS
netmonitor-toolbar-filter-other = Other
# This is the label displayed in the network toolbar for the url filtering
# textbox.
netmonitor-toolbar-filter-freetext-label = Filter URLs
# This is the shortcut key to focus on the toolbar url filtering textbox.
netmonitor-toolbar-filter-freetext-key = CmdOrCtrl+F
# This is the shortcut key to toggle the search panel.
netmonitor-toolbar-search-key = CmdOrCtrl+Shift+F
# This is the shortcut key to copy a selected request url from the network
# table.
netmonitor-toolbar-copy-key = CmdOrCtrl+C
# This is the title used for the MDN icon in the filtering textbox.
netmonitor-toolbar-filter-freetext-learn-more = Learn more about filtering
# This is the label displayed for the checkbox for enabling persistent logs.
netmonitor-toolbar-enable-persistent-logs-label = Persist Logs
# This is the tooltip displayed for the checkbox for enabling persistent logs.
netmonitor-toolbar-enable-persistent-logs-tooltip = If you enable this option the requests list will not be cleared each time you navigate to a new page
# This is the label displayed for the checkbox for disabling browser cache.
netmonitor-toolbar-disable-cache-label = Disable Cache
# This is the tooltip displayed for the checkbox for disabling browser cache.
netmonitor-toolbar-disable-cache-tooltip =
    .title = Disable HTTP cache
# This is the tooltip displayed in the network toolbar for the “Clear” button.
netmonitor-toolbar-clear =
    .title = Clear
# This is the tooltip displayed in the network toolbar for the toggle recording
# button.
netmonitor-toolbar-toggle-recording =
    .title = Pause/Resume recording network log
# This is the tooltip displayed in the network toolbar for the search button.
netmonitor-toolbar-search =
    .title = Search
# This is the tooltip displayed in the network toolbar for the new HTTP Custom
# Request button.
netmonitor-toolbar-http-custom-request =
    .title = New Request

## Strings used in the header context menu of the DevTools Network Panel
## request table

netmonitor-toolbar-reset-columns = Reset Columns
netmonitor-toolbar-reset-sorting = Reset Sorting
netmonitor-toolbar-resize-column-to-fit-content = Resize Column To Fit Content
# This is the tooltip displayed when the draggable resizer in the network table
# headers is hovered.
netmonitor-toolbar-resize-column-to-fit-content-title =
    .title = Double-click to fit column to content
# This is the label for the submenu grouping the timing columns.
netmonitor-toolbar-timings = Timings
# This is the label for the submenu grouping the response header columns.
netmonitor-toolbar-response-headers = Response Headers
