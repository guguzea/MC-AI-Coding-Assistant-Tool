---
title: "com.destroystokyo.paper.event.player.PlayerHandshakeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/event/player/PlayerHandshakeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated @Internal public PlayerHandshakeEvent(String originalHandshake, boolean cancelled)`
- `@Internal public PlayerHandshakeEvent(String originalHandshake, String originalSocketAddressHostname, boolean cancelled)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public String getOriginalHandshake()`
- `public String getOriginalSocketAddressHostname()`
- `public @Nullable String getServerHostname()`
- `public void setServerHostname(String serverHostname)`
- `public @Nullable String getSocketAddressHostname()`
- `public void setSocketAddressHostname(String socketAddressHostname)`
- `public @Nullable UUID getUniqueId()`
- `public void setUniqueId(UUID uniqueId)`
- `public @Nullable String getPropertiesJson()`
- `public boolean isFailed()`
- `public void setFailed(boolean failed)`
- `public void setPropertiesJson(String propertiesJson)`
- `public Component failMessage()`
- `public void failMessage(Component failMessage)`
- `@Deprecated public String getFailMessage()`
- `@Deprecated public void setFailMessage(String failMessage)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
