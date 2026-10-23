---
title: "org.bukkit.event.player.AsyncPlayerPreLoginEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/event/player/AsyncPlayerPreLoginEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `static class AsyncPlayerPreLoginEvent.Result`
- `void allow()`
- `void disallow(AsyncPlayerPreLoginEvent.Result result, String message)`
- `void disallow(PlayerPreLoginEvent.Result result, String message)`
- `InetAddress getAddress()`
- `static HandlerList getHandlerList()`
- `HandlerList getHandlers()`
- `String getKickMessage()`
- `AsyncPlayerPreLoginEvent.Result getLoginResult()`
- `String getName()`
- `PlayerProfile getPlayerProfile()`
- `PlayerPreLoginEvent.Result getResult()`
- `UUID getUniqueId()`
- `void setKickMessage(String message)`
- `void setLoginResult(AsyncPlayerPreLoginEvent.Result result)`
- `void setPlayerProfile(PlayerProfile profile)`
- `void setResult(PlayerPreLoginEvent.Result result)`
