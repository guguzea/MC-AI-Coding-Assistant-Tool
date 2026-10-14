---
title: "com.destroystokyo.paper.event.player.PlayerClientOptionsChangeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerClientOptionsChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerClientOptionsChangeEvent**
`@NullMarked public class PlayerClientOptionsChangeEvent extends PlayerEvent`
- `@Internal public PlayerClientOptionsChangeEvent(Player player, Map<ClientOption<?>, ?> options)`
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
- `public boolean hasTextFilteringEnabled()`
- `public boolean hasTextFilteringChanged()`
- `public boolean allowsServerListings()`
- `public boolean hasAllowServerListingsChanged()`
- `public ClientOption.ParticleVisibility getParticleVisibility()`
- `public boolean hasParticleVisibilityChanged()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
