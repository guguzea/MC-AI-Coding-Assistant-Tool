---
title: "io.papermc.paper.connection.PlayerConnection"
package: "io.papermc.paper.connection"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/connection/PlayerConnection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PlayerConnection**
`public interface PlayerConnection`
- `void disconnect(Component component)`
- `boolean isConnected()`
- `boolean isTransferred()`
- `SocketAddress getAddress()`
- `InetSocketAddress getClientAddress()`
- `@Nullable InetSocketAddress getVirtualHost()`
- `@Nullable InetSocketAddress getHAProxyAddress()`
