---
title: "com.destroystokyo.paper.event.player.PlayerHandshakeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/event/player/PlayerHandshakeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerHandshakeEvent&#8203;(@NotNull @NotNull String originalHandshake, boolean cancelled)`
- `public PlayerHandshakeEvent&#8203;(@NotNull @NotNull String originalHandshake, @NotNull @NotNull String originalSocketAddressHostname, boolean cancelled)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancelled)`
- `@NotNull public @NotNull String getOriginalHandshake()`
- `@NotNull public @NotNull String getOriginalSocketAddressHostname()`
- `@Nullable public @Nullable String getServerHostname()`
- `public void setServerHostname&#8203;(@NotNull @NotNull String serverHostname)`
- `@Nullable public @Nullable String getSocketAddressHostname()`
- `public void setSocketAddressHostname&#8203;(@NotNull @NotNull String socketAddressHostname)`
- `@Nullable public @Nullable UUID getUniqueId()`
- `public void setUniqueId&#8203;(@NotNull @NotNull UUID uniqueId)`
- `@Nullable public @Nullable String getPropertiesJson()`
- `public boolean isFailed()`
- `public void setFailed&#8203;(boolean failed)`
- `public void setPropertiesJson&#8203;(@NotNull @NotNull String propertiesJson)`
- `@NotNull public @NotNull Component failMessage()`
- `public void failMessage&#8203;(@NotNull @NotNull Component failMessage)`
- `@NotNull @Deprecated public @NotNull String getFailMessage()`
- `@Deprecated public void setFailMessage&#8203;(@NotNull @NotNull String failMessage)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
