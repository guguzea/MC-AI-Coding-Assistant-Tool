---
title: "io.papermc.paper.event.player.PlayerChangeBeaconEffectEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerChangeBeaconEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerChangeBeaconEffectEvent**
`@NullMarked public class PlayerChangeBeaconEffectEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerChangeBeaconEffectEvent(Player player, @Nullable PotionEffectType primary, @Nullable PotionEffectType secondary, Block beacon)`
- `public @Nullable PotionEffectType getPrimary()`
- `public void setPrimary(@Nullable PotionEffectType primary)`
- `public @Nullable PotionEffectType getSecondary()`
- `public void setSecondary(@Nullable PotionEffectType secondary)`
- `public Block getBeacon()`
- `public boolean willConsumeItem()`
- `public void setConsumeItem(boolean consumeItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
