---
title: "com.destroystokyo.paper.event.player.PlayerHandshakeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/player/PlayerHandshakeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerHandshakeEvent(@NotNull @NotNull String originalHandshake, boolean cancelled)`
- `public PlayerHandshakeEvent(@NotNull @NotNull String originalHandshake, @NotNull @NotNull String originalSocketAddressHostname, boolean cancelled)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull String getOriginalHandshake()`
- `@NotNull public @NotNull String getOriginalSocketAddressHostname()`
- `@Nullable public @Nullable String getServerHostname()`
- `public void setServerHostname(@NotNull @NotNull String serverHostname)`
- `@Nullable public @Nullable String getSocketAddressHostname()`
- `public void setSocketAddressHostname(@NotNull @NotNull String socketAddressHostname)`
- `@Nullable public @Nullable UUID getUniqueId()`
- `public void setUniqueId(@NotNull @NotNull UUID uniqueId)`
- `@Nullable public @Nullable String getPropertiesJson()`
- `public boolean isFailed()`
- `public void setFailed(boolean failed)`
- `public void setPropertiesJson(@NotNull @NotNull String propertiesJson)`
- `@NotNull public @NotNull Component failMessage()`
- `public void failMessage(@NotNull @NotNull Component failMessage)`
- `@NotNull @Deprecated public @NotNull String getFailMessage()`
- `@Deprecated public void setFailMessage(@NotNull @NotNull String failMessage)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
