---
title: "com.destroystokyo.paper.event.player.PlayerClientOptionsChangeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/event/player/PlayerClientOptionsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerClientOptionsChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull String locale, int viewDistance, @NotNull @NotNull ClientOption.ChatVisibility chatVisibility, boolean chatColors, @NotNull @NotNull SkinParts skinParts, @NotNull @NotNull MainHand mainHand)`
- `public PlayerClientOptionsChangeEvent(@NotNull @NotNull Player player, @NotNull @NotNull Map<ClientOption<?>,?> options)`
- `@NotNull public @NotNull String getLocale()`
- `public boolean hasLocaleChanged()`
- `public int getViewDistance()`
- `public boolean hasViewDistanceChanged()`
- `@NotNull public @NotNull ClientOption.ChatVisibility getChatVisibility()`
- `public boolean hasChatVisibilityChanged()`
- `public boolean hasChatColorsEnabled()`
- `public boolean hasChatColorsEnabledChanged()`
- `@NotNull public @NotNull SkinParts getSkinParts()`
- `public boolean hasSkinPartsChanged()`
- `@NotNull public @NotNull MainHand getMainHand()`
- `public boolean hasMainHandChanged()`
- `public boolean allowsServerListings()`
- `public boolean hasAllowServerListingsChanged()`
- `public boolean hasTextFilteringEnabled()`
- `public boolean hasTextFilteringChanged()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
