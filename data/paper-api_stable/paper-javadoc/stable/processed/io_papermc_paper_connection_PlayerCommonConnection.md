---
title: "io.papermc.paper.connection.PlayerCommonConnection"
package: "io.papermc.paper.connection"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/connection/PlayerCommonConnection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PlayerCommonConnection**
`public interface PlayerCommonConnection extends WritablePlayerCookieConnection, ReadablePlayerCookieConnection, PluginMessageRecipient`
- `void sendReportDetails(Map<String,String> details)`
- `void sendLinks(ServerLinks links)`
- `void transfer(String host, int port)`
- `<T> T getClientOption(ClientOption<T> type)`
- `@Nullable String getClientBrandName()`
