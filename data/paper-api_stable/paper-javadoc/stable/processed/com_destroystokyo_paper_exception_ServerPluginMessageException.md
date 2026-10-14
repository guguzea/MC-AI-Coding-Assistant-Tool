---
title: "com.destroystokyo.paper.exception.ServerPluginMessageException"
package: "com.destroystokyo.paper.exception"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/exception/ServerPluginMessageException.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ServerPluginMessageException**
`public class ServerPluginMessageException extends ServerPluginException`
- `public ServerPluginMessageException(String message, Throwable cause, Plugin responsiblePlugin, Player player, String channel, byte[] data)`
- `public ServerPluginMessageException(Throwable cause, Plugin responsiblePlugin, Player player, String channel, byte[] data)`
- `protected ServerPluginMessageException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace, Plugin responsiblePlugin, Player player, String channel, byte[] data)`
- `public String getChannel()`
- `public byte[] getData()`
- `public Player getPlayer()`
