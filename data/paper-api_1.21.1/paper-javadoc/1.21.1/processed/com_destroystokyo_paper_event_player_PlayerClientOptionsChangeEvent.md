---
title: "com.destroystokyo.paper.event.player.PlayerClientOptionsChangeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/1.21.1/com/destroystokyo/paper/event/player/PlayerClientOptionsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerClientOptionsChangeEvent(Player player, String locale, int viewDistance, ClientOption.ChatVisibility chatVisibility, boolean chatColors, SkinParts skinParts, MainHand mainHand)`
- `@Internal public PlayerClientOptionsChangeEvent(Player player, Map<ClientOption<?>,?> options)`
- `public String getLocale()`
- `public boolean hasLocaleChanged()`
- `public int getViewDistance()`
- `public boolean hasViewDistanceChanged()`
- `public ClientOption.ChatVisibility getChatVisibility()`
- `public boolean hasChatVisibilityChanged()`
- `public boolean hasChatColorsEnabled()`
- `public boolean hasChatColorsEnabledChanged()`
- `public SkinParts getSkinParts()`
- `public boolean hasSkinPartsChanged()`
- `public MainHand getMainHand()`
- `public boolean hasMainHandChanged()`
- `public boolean allowsServerListings()`
- `public boolean hasAllowServerListingsChanged()`
- `public boolean hasTextFilteringEnabled()`
- `public boolean hasTextFilteringChanged()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
