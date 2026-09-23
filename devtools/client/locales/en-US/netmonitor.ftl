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

## Strings used in the context menus of the DevTools Network Panel

# This is the label displayed for the copy sub-menu in the context menu for a
# request.
netmonitor-context-copy-value =
    .label = Copy Value
    .accesskey = C
# This is the label displayed on the context menu that copies all data.
netmonitor-context-copy-all =
    .label = Copy All
    .accesskey = A
# This is the label displayed on the context menu that copies the selected
# request's url.
netmonitor-context-copy-url =
    .label = Copy URL
    .accesskey = U
# This is the label displayed on the context menu that copies the selected
# request's url parameters.
netmonitor-context-copy-url-params =
    .label = Copy URL Parameters
    .accesskey = P
# This is the label displayed on the context menu that copies the selected
# request's data.
# Variables:
#   $method (String): the request method, e.g. POST, PATCH, PUT or DELETE.
netmonitor-context-copy-request-data =
    .label = Copy { $method } Data
    .accesskey = D
# This is the label displayed on the context menu that copies the selected
# request as a PowerShell command.
netmonitor-context-copy-as-powershell =
    .label = Copy as PowerShell
    .accesskey = S
# This is the label displayed on the context menu that copies the selected
# request as a cURL command. The capitalization is part of the official name
# and should be used throughout all languages.
# See https://en.wikipedia.org/wiki/CURL
netmonitor-context-copy-as-curl =
    .label = Copy as cURL
    .accesskey = C
# This is the label displayed on the context menu that copies the selected
# request as a cURL command for Windows.
netmonitor-context-copy-as-curl-win =
    .label = { netmonitor-context-copy-as-curl.label } (Windows)
    .accesskey = C
# This is the label displayed on the context menu that copies the selected
# request as a cURL command for POSIX platforms.
netmonitor-context-copy-as-curl-posix =
    .label = { netmonitor-context-copy-as-curl.label } (POSIX)
    .accesskey = P
# This is the label displayed on the context menu that copies the selected
# request as a fetch request.
netmonitor-context-copy-as-fetch =
    .label = Copy as Fetch
    .accesskey = F
# This is the label displayed on the context menu that copies the selected
# item's request headers.
netmonitor-context-copy-request-headers =
    .label = Copy Request Headers
    .accesskey = q
# This is the label displayed on the context menu that copies the selected
# item's response headers.
netmonitor-context-copy-response-headers =
    .label = Copy Response Headers
    .accesskey = s
# This is the label displayed on the context menu that copies the selected
# response as a string.
netmonitor-context-copy-response =
    .label = Copy Response
    .accesskey = R
# This is the label displayed on the context menu that copies the selected
# image as a data URI.
netmonitor-context-copy-image-as-data-uri =
    .label = Copy Image as Data URI
    .accesskey = I
# This is the label displayed on the context menu that sets a network override
# for the URL of the request. Note that this menu item is only displayed when
# netmonitor-context-remove-override is not, and vice versa.
netmonitor-context-set-override =
    .label = Set Network Override
    .accesskey = O
# This is the label displayed on the context menu that removes a network
# override for the URL of the request. Note that this menu item is only
# displayed when netmonitor-context-set-override is not, and vice versa.
netmonitor-context-remove-override =
    .label = Remove Network Override
    .accesskey = O
# This is the label displayed on the context menu that opens the selected
# request as a fetch command in the console.
netmonitor-context-use-as-fetch =
    .label = Use as Fetch in Console
    .accesskey = F
# This is the label displayed on the context menu that saves the response.
netmonitor-context-save-response-as =
    .label = Save Response As
    .accesskey = v
# This is the label displayed on the context menu that copies all requests in
# the HAR format.
netmonitor-context-copy-all-as-har =
    .label = Copy All as HAR
    .accesskey = o
# This is the label displayed on the context menu that saves the selected
# request in the HAR format.
netmonitor-context-save-as-har =
    .label = Save as HAR
    .accesskey = H
# This is the label displayed on the context menu that saves all requests in
# the HAR format.
netmonitor-context-save-all-as-har =
    .label = Save All as HAR
    .accesskey = H
# This is the label displayed on the settings menu item that imports a HAR
# file. The file picker it opens is titled with
# netmonitor-har-import-har-dialog-title.
netmonitor-context-import-har =
    .label = Import HAR File
    .accesskey = I
# This is the label displayed on the context menu for requests in search panel
# result entries when no other operations are possible as the request no longer
# exists.
netmonitor-context-hint-request-not-available =
    .label = No operations possible because the request is no longer available
# This is the label displayed on the context menu that resends the currently
# displayed request immediately.
netmonitor-context-resend =
    .label = Resend
    .accesskey = n
# This is the label displayed on the context menu that opens a form to edit and
# resend the currently displayed request.
netmonitor-context-edit-and-resend =
    .label = Edit and Resend
    .accesskey = E
# This is the label displayed on the context menu that blocks any requests
# matching the selected request's URL.
netmonitor-context-block-url =
    .label = Block URL
# This is the label displayed on the context menu that unblocks any requests
# matching the selected request's URL.
netmonitor-context-unblock-url =
    .label = Unblock URL
# This is the label displayed on the context menu that opens the selected
# request in a new tab.
netmonitor-context-new-tab =
    .label = Open in New Tab
    .accesskey = T
# This is the label displayed on the context menu that opens the selected
# request in the debugger.
netmonitor-context-open-in-debugger =
    .label = Open in Debugger
    .accesskey = D
# This is the label displayed on the context menu that opens the selected
# request in the style editor.
netmonitor-context-open-in-style-editor =
    .label = Open in Style Editor
    .accesskey = S
# This is the label displayed on the context menu that shows the performance
# analysis tools.
netmonitor-context-perf-tools =
    .label = Start Performance Analysis…
    .accesskey = A

## Strings used in the request blocking context menu of the DevTools Network
## Panel

netmonitor-request-blocking-menu-enable-all-blocked-urls = Enable all
netmonitor-request-blocking-menu-disable-all-blocked-urls = Disable all
netmonitor-request-blocking-menu-remove-all-blocked-urls = Remove all

## Strings used for the HAR import and export of the DevTools Network Panel

# This is the label used for the import file open dialog.
netmonitor-har-import-har-dialog-title = Import HAR File
# This is the label for the HAR file filter of the import file open dialog.
netmonitor-har-import-dialog-har-filter = HAR Files
# This is the label for the “all files” filter of the import file open dialog.
netmonitor-har-import-dialog-all-filter = All Files

## Labels for the columns of the DevTools Network Panel messages table, used
## for WebSocket and server-sent event messages. Each is displayed in the table
## header, and in the header context menu that toggles the column's visibility.

netmonitor-ws-toolbar-data = Data
netmonitor-ws-toolbar-size = Size
netmonitor-ws-toolbar-op-code = OpCode
netmonitor-ws-toolbar-mask-bit = MaskBit
netmonitor-ws-toolbar-fin-bit = FinBit
netmonitor-ws-toolbar-time = Time
netmonitor-ws-toolbar-event-name = Event Name
netmonitor-ws-toolbar-last-event-id = Last Event ID
netmonitor-ws-toolbar-retry = Retry

## Strings used in the messages panel of the DevTools Network Panel

# This is the tooltip displayed in the messages panel toolbar for the “Clear”
# button.
netmonitor-ws-toolbar-clear =
    .title = Clear
# This is the label displayed in the messages panel toolbar for the message
# filtering textbox.
netmonitor-ws-toolbar-filter-freetext-label = Filter Messages
# This is the shortcut key to focus on the messages panel message filtering
# textbox.
netmonitor-ws-toolbar-filter-freetext-key = CmdOrCtrl+E
# This is the label displayed in the messages panel table header context menu.
netmonitor-ws-toolbar-reset-columns = Reset Columns
# This is the text displayed in the messages panel when the connection is
# closed.
netmonitor-ws-connection-closed = Connection Closed
# This is the label used as accessible text for the “sent” type icon in the
# messages table's data column.
netmonitor-ws-type-sent = Sent
# This is the label used as accessible text for the “received” type icon in the
# messages table's data column.
netmonitor-ws-type-received = Received
# This is the label displayed in the messages panel identifying the raw data.
# Variables:
#   $formattedSize (String): the formatted size of the raw data.
netmonitor-ws-raw-data-header = Raw Data ({ $formattedSize })
# This is the text displayed in the messages panel when the number of messages
# is over the truncation limit.
# Variables:
#   $messageCount (Number): the number of truncated messages.
netmonitor-ws-truncated-messages-warning =
    { $messageCount ->
        [one] { $messageCount } message has been truncated to conserve memory
       *[other] { $messageCount } messages have been truncated to conserve memory
    }

## Strings used in the message filter menu and the message context menu of the
## DevTools Network Panel messages panel. The filter menu's labels are also
## used as the caption of the button that opens it.

# This is the label displayed on the menu that shows all messages.
netmonitor-ws-context-all =
    .label = All
    .accesskey = A
# This is the label displayed on the menu that shows sent messages.
netmonitor-ws-context-sent =
    .label = Sent
    .accesskey = S
# This is the label displayed on the menu that shows received messages.
netmonitor-ws-context-received =
    .label = Received
    .accesskey = R
# This is the label displayed on the menu that shows WebSocket control frames.
netmonitor-ws-context-control-frames =
    .label = Control
    .accesskey = o
# This is the label displayed on the context menu of a message that copies it.
netmonitor-ws-context-copy-frame =
    .label = Copy Message
    .accesskey = C
# This is the label displayed on the context menu of a binary message that
# copies it as Base64.
netmonitor-ws-context-copy-frame-as-base64 =
    .label = Copy as Base64
    .accesskey = B
# This is the label displayed on the context menu of a binary message that
# copies it as hexadecimal.
netmonitor-ws-context-copy-frame-as-hex =
    .label = Copy as Hex
    .accesskey = H
# This is the label displayed on the context menu of a binary message that
# copies it as text.
netmonitor-ws-context-copy-frame-as-text =
    .label = Copy as Text
    .accesskey = T

## Strings used in the status bar of the DevTools Network Panel messages panel

# This label is displayed in the messages table footer providing the number of
# messages.
# Variables:
#   $messageCount (Number): the total number of messages.
network-menu-ws-summary-messages-count =
    { $messageCount ->
        [0] No messages
        [one] { $messageCount } message
       *[other] { $messageCount } messages
    }
network-menu-ws-summary-tooltip-messages-count =
    .title = Number of messages
network-menu-ws-summary-tooltip-messages-total-size =
    .title = Total size of displayed messages
# This label shows the summary size information for the currently displayed
# messages.
# Variables:
#   $formattedTotalSize (String): the formatted size of the transferred data.
#   $formattedSentSize (String): the formatted size of the sent data.
#   $formattedReceivedSize (String): the formatted size of the received data.
network-menu-ws-summary-messages-transferred-size = { $formattedTotalSize } total, { $formattedSentSize } sent, { $formattedReceivedSize } received
network-menu-ws-summary-tooltip-messages-total-time =
    .title = Total elapsed time between the first and last displayed messages

## Strings used as tooltips for the security state icon of a request in the
## DevTools Network Panel request list

# Used for requests that were performed over a secure channel with a
# third-party root (i.e. the connection was encrypted, but with a certificate
# issued by a root not in Mozilla's Root CA Program).
netmonitor-security-state-secure-custom-root =
    .title = The connection used to fetch this resource was verified by a certificate issuer that is not recognized by Mozilla.
# Used for requests that were performed over a secure channel (i.e. the
# connection was encrypted).
netmonitor-security-state-secure =
    .title = The connection used to fetch this resource was secure.
# Used for requests that were performed over an insecure channel (i.e. the
# connection was not https).
netmonitor-security-state-insecure =
    .title = The connection used to fetch this resource was not secure.
# Used for requests that failed due to security issues.
netmonitor-security-state-broken =
    .title = A security error prevented the resource from being loaded.
# Used for requests that had minor security issues.
netmonitor-security-state-weak =
    .title = This resource was transferred over a connection that used weak encryption.

## Strings used in the security panel of the DevTools Network Panel

# Indicates that a specific security feature is used by a connection.
# For example: "HTTP Strict Transport Security: Enabled"
netmonitor-security-enabled = Enabled
# Indicates that a specific security feature is not used by a connection.
# For example: "HTTP Strict Transport Security: Disabled"
netmonitor-security-disabled = Disabled
# Header for the section containing security information related to the remote
# host. For example: "Host example.com:"
# Variables:
#   $host (String): the domain name of the remote host.
netmonitor-security-host-header = Host { $host }:
# Indicates that a certain piece of information is not available to be
# displayed. For example a certificate that has no organization defined:
#   Organization: <Not Available>
netmonitor-security-not-available = <Not Available>
# A tooltip for the warning icon that indicates a connection uses an insecure
# cipher suite.
netmonitor-security-warning-cipher = The cipher used for encryption is deprecated and insecure.
# The label displayed if a security error prevented the connection.
netmonitor-security-error = An error occurred:
# The label of the section containing information related to the secure
# connection.
netmonitor-security-connection = Connection:
# The label describing the TLS/SSL protocol version.
netmonitor-security-protocol-version = Protocol version:
# The label describing the cipher suite used to secure this connection.
netmonitor-security-cipher-suite = Cipher suite:
# The label describing the key exchange group suite used to secure this
# connection.
netmonitor-security-kea-group = Key Exchange Group:
# The value describing the case when no group was used.
netmonitor-security-kea-group-none = none
# The value describing the case when a custom group was used.
netmonitor-security-kea-group-custom = custom
# The value describing an unknown group.
netmonitor-security-kea-group-unknown = unknown group
# The label describing the signature scheme used for the server certificate in
# this connection.
netmonitor-security-signature-scheme = Signature Scheme:
# The value describing the case when no signature was used.
netmonitor-security-signature-scheme-none = none
# The value describing an unknown signature scheme.
netmonitor-security-signature-scheme-unknown = unknown signature scheme
# The label specifying whether the connection used ECH (Encrypted Client
# Hello).
netmonitor-security-used-ech = Used Encrypted Client Hello (ECH):
# The label specifying whether the connection used Delegated Credentials.
netmonitor-security-used-delegated-credentials = Used Delegated Credentials:
# The label specifying whether the connection made an OCSP (Online Certificate
# Status Protocol) request.
netmonitor-security-used-ocsp = Used Online Certificate Status Protocol (OCSP):
# The label specifying whether the connection made a private DNS lookup, such
# as with DoH (DNS over HTTPS).
netmonitor-security-used-private-dns = Used Private DNS:
# The label describing the usage of HTTP Strict Transport Security.
netmonitor-security-hsts = HTTP Strict Transport Security:
# The label describing the usage of Public Key Pinning.
netmonitor-security-hpkp = Public Key Pinning:
# The label of the server certificate section.
netmonitor-security-certificate = Certificate:

## Strings used for the certificate details in the security panel of the
## DevTools Network Panel

# A label for a certificate section. This section displays the name and
# organization the fingerprints have been assigned to.
netmonitor-security-cert-subject-info = Issued To
# A label for a certificate section. This section displays the name and
# organization that issued the fingerprints.
netmonitor-security-cert-issuer-info = Issued By
# A label used for the Issued To and Issued By sub-sections.
netmonitor-security-cert-common-name = Common Name (CN):
# A label used for the Issued To and Issued By sub-sections.
netmonitor-security-cert-organization = Organization (O):
# A label used for the Issued To and Issued By sub-sections.
netmonitor-security-cert-organizational-unit = Organizational Unit (OU):
# A label for a certificate section. This section displays the valid period of
# the certificate.
netmonitor-security-cert-period-of-validity = Period of Validity
# A label used for the Period of Validity sub-section.
netmonitor-security-cert-begins = Begins On:
# A label used for the Period of Validity sub-section.
netmonitor-security-cert-expires = Expires On:
# A label for a certificate section listing the certificate's fingerprints.
netmonitor-security-cert-fingerprints = Fingerprints
# A label used for the Fingerprints sub-section.
netmonitor-security-cert-sha256-fingerprint = SHA-256 Fingerprint:
# A label used for the Fingerprints sub-section.
netmonitor-security-cert-sha1-fingerprint = SHA1 Fingerprint:
netmonitor-security-cert-transparency = Transparency:
# Indicates that there are valid signed certificate timestamps. This is a
# property for the "Transparency" field.
netmonitor-security-cert-transparency-status-ok = Valid SCT records
# Indicates that there are not enough valid signed certificate timestamps. This
# is a property for the "Transparency" field.
netmonitor-security-cert-transparency-status-not-enough-scts = Not enough SCTs
# Indicates that there are not enough diverse signed certificate timestamps.
# This is a property for the "Transparency" field.
netmonitor-security-cert-transparency-status-not-diverse-scts = Not diverse SCTs

## Strings used in the headers panel of the DevTools Network Panel

# The label of the block url toolbar button.
netmonitor-headers-toolbar-block = Block
# The text displayed when there are no headers available.
netmonitor-headers-empty-text = No headers for this request
# The text displayed for the filtering input.
netmonitor-headers-filter-text = Filter Headers
# The label identifying the request headers.
netmonitor-request-headers = Request Headers
# The label identifying the request headers from the upload stream of a POST
# request's body.
netmonitor-request-headers-from-upload = Request headers from upload stream
# The label identifying the response headers.
netmonitor-response-headers = Response Headers
# The label identifying the early hints response headers. Do not translate
# `Early Hints`, since it's the header type.
netmonitor-early-hints-response-headers = Early Hints Response Headers
# The label identifying the remote address.
netmonitor-headers-address = Address
# The label identifying the proxy address.
netmonitor-headers-proxy-address = Proxy Address
# The label identifying the early hints status code. `Early Hints` is an HTTP
# status and should not be translated.
netmonitor-headers-early-hints-status = Early Hints Status
# The label identifying the status code.
netmonitor-headers-status = Status
# The label identifying the status code for the proxy.
netmonitor-headers-proxy-status = Proxy Status
# The label providing the size details.
# Variables:
#   $transferredSize (String): the transferred size.
#   $contentSize (String): the size.
netmonitor-headers-size-details = { $transferredSize } ({ $contentSize } size)
# The label identifying the http version.
netmonitor-headers-version = Version
# The label identifying the http version of the proxy.
netmonitor-headers-proxy-version = Proxy Version
# The tooltip of the link to external documentation for status codes.
netmonitor-summary-learn-more =
    .title = Learn more about status code
# The label identifying the referrer policy.
netmonitor-headers-referrer-policy = Referrer Policy
# The label identifying the content blocking mode.
netmonitor-headers-content-blocking = Blocking
# The label identifying the request priority.
netmonitor-headers-request-priority = Request Priority
# The label identifying the DNS resolution.
netmonitor-headers-dns = DNS Resolution
# The label value identifying the Basic DNS resolution.
netmonitor-headers-dns-basic = System
# The label value identifying the DNS over HTTPS resolution.
netmonitor-headers-dns-over-https = DNS over HTTPS
# The label of the button that opens a form to edit and resend the currently
# displayed request.
netmonitor-summary-edit-and-resend =
    .label = Edit and Resend
# The label of the button that toggles the view for raw request/response
# headers of the currently displayed request.
netmonitor-headers-raw = Raw
# The message displayed in the notification shown when a request has been
# blocked by CORS, with a more specific reason shown in the parenthesis.
# Variables:
#   $reason (String): the specific reason the request was blocked.
netmonitor-headers-blocked-by-cors = Response body is not available to scripts (Reason: { $reason })
# The tooltip displayed on the learn more link of the blocked by CORS
# notification.
netmonitor-headers-blocked-by-cors-tooltip = Learn more about this CORS error

## Strings used in the cookies panel of the DevTools Network Panel

# The text displayed when there are no cookies available.
netmonitor-cookies-empty-text = No cookies for this request
# The text displayed for the filtering input.
netmonitor-cookies-filter-text = Filter Cookies
# The label identifying the request cookies.
netmonitor-request-cookies = Request Cookies
# The label identifying the response cookies.
netmonitor-response-cookies = Response Cookies

## Strings used in the cache panel of the DevTools Network Panel

# The label text for the parent node in the tree view.
netmonitor-cache-cache = Cache
# The text displayed when cache information is not available.
netmonitor-cache-empty = No cache information
# The text displayed under a node that has no information available.
netmonitor-cache-not-available = Not Available
# The label text for the data size of the cached object.
netmonitor-cache-data-size = Data Size
# The label text for the expires time of the cached object.
netmonitor-cache-expires = Expires
# The label text for the fetch count of the cached object.
netmonitor-cache-fetch-count = Fetch Count
# The label text for the last fetched date/time of the cached object.
netmonitor-cache-last-fetched = Last Fetched
# The label text for the last modified date/time of the cached object.
netmonitor-cache-last-modified = Last Modified
# The label text for the device a cached object was fetched from (e.g. "disk").
netmonitor-cache-device = Device

## Strings used in the tooltip of the waterfall column of the DevTools Network
## Panel request table. Each one is one part of the tooltip, joined into a list.

# Variables:
#   $time (Number): the total time, in milliseconds.
netmonitor-waterfall-tooltip-total = Total { $time } ms
# Variables:
#   $time (Number): the blocked time, in milliseconds.
netmonitor-waterfall-tooltip-blocked = Blocked { $time } ms
# Variables:
#   $time (Number): the dns time, in milliseconds.
netmonitor-waterfall-tooltip-dns = DNS { $time } ms
# Variables:
#   $time (Number): the tls setup time, in milliseconds.
netmonitor-waterfall-tooltip-ssl = TLS { $time } ms
# Variables:
#   $time (Number): the connect time, in milliseconds.
netmonitor-waterfall-tooltip-connect = Connect { $time } ms
# Variables:
#   $time (Number): the send time, in milliseconds.
netmonitor-waterfall-tooltip-send = Send { $time } ms
# Variables:
#   $time (Number): the wait time, in milliseconds.
netmonitor-waterfall-tooltip-wait = Wait { $time } ms
# Variables:
#   $time (Number): the receive time, in milliseconds.
netmonitor-waterfall-tooltip-receive = Receive { $time } ms

## Strings used in the timings panel of the DevTools Network Panel

# The title of the section containing the request timings.
netmonitor-timings-request-timing = Request Timing
# The title of the section containing the server timings transferred from the
# server through the "Server-Timing" header.
netmonitor-timings-server-timing = Server Timing
# The title of the section containing the service worker timings transferred
# from the service worker.
netmonitor-timings-service-worker-timing = Service Worker Timing
# The queued time relative to the first request.
# Variables:
#   $time (String): time expressed in milliseconds or minutes.
netmonitor-timings-queued-at = Queued: { $time }
# When the request actually started, relative to the first request.
# Variables:
#   $time (String): time expressed in milliseconds or minutes.
netmonitor-timings-started-at = Started: { $time }
# When the request actually finished downloading, relative to the first
# request.
# Variables:
#   $time (String): time expressed in milliseconds or minutes.
netmonitor-timings-downloaded-at = Downloaded: { $time }
# The message displayed when a request has been blocked.
netmonitor-timings-no-timings = No timings for this request
# The label identifying the amount of time spent in a "blocked" state.
netmonitor-timings-blocked = Blocked:
# The label identifying the amount of time spent in a "dns" state.
netmonitor-timings-dns = DNS Resolution:
# The label identifying the amount of time spent in a "tls" handshake state.
netmonitor-timings-ssl = TLS Setup:
# The label identifying the amount of time spent in a "connect" state.
netmonitor-timings-connect = Connecting:
# The label identifying the amount of time spent in a "send" state.
netmonitor-timings-send = Sending:
# The label identifying the amount of time spent in a "wait" state.
netmonitor-timings-wait = Waiting:
# The label identifying the amount of time spent in a "receive" state.
netmonitor-timings-receive = Receiving:
# The label identifying the amount of time spent during the launch of the
# service worker.
netmonitor-timings-launch-service-worker = Startup:
# The label identifying the amount of time spent while a request is made to the
# service worker.
netmonitor-timings-request-to-service-worker = Dispatch fetch:
# The label identifying the amount of time spent while a request is handled by
# the service worker.
netmonitor-timings-handled-by-service-worker = Handle fetch:
# The tooltip of the link to external documentation for timings.
netmonitor-timings-learn-more =
    .title = Learn more about timings

## Strings used in the custom request forms of the DevTools Network Panel

# The title of the new custom request form.
netmonitor-custom-new-request = New Request
# The label above the method text input field of the new custom request form.
netmonitor-custom-new-request-method-label = Method
# The label above the url text input field of the new custom request form.
netmonitor-custom-new-request-url-label = URL
# The label above the query string entry in the custom request form.
netmonitor-custom-query = Query String
# The label above the query string entry in the new custom request form.
netmonitor-custom-url-parameters = URL Parameters
# The label above the request headers entry in the custom request form.
netmonitor-custom-headers = Request Headers
# The label above the request headers entry in the new custom request form.
netmonitor-custom-new-request-headers = Headers
# The placeholder on the name input of the headers and query params in the new
# custom request form.
netmonitor-custom-placeholder-name =
    .placeholder = name
# The placeholder on the value input of the headers and query params in the new
# custom request form.
netmonitor-custom-placeholder-value =
    .placeholder = value
# The label above the request body entry in the new custom request form.
netmonitor-custom-post-body = Body
# The placeholder on the body textarea in the new custom request form.
netmonitor-custom-post-body-placeholder =
    .placeholder = payload
# The label above the request body entry in the custom request form.
netmonitor-custom-post-data = Request Body
# The label on the button which sends the custom request.
netmonitor-custom-send = Send
# The label on the button which cancels and closes the custom request form.
netmonitor-custom-cancel = Cancel
# The label on the button which clears the content of the new custom request
# panel.
netmonitor-custom-clear = Clear
# The tooltip and accessible name of the remove button of a headers or query
# params item.
netmonitor-custom-remove-item =
    .title = Remove item
    .aria-label = Remove item
