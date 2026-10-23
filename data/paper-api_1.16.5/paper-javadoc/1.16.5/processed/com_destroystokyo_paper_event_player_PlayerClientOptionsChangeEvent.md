---
title: "com.destroystokyo.paper.event.player.PlayerClientOptionsChangeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/event/player/PlayerClientOptionsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerClientOptionsChangeEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull String locale, int viewDistance, @NotNull @NotNull ClientOption.ChatVisibility chatVisibility, boolean chatColors, @NotNull @NotNull SkinParts skinParts, @NotNull @NotNull MainHand mainHand)`
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
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
