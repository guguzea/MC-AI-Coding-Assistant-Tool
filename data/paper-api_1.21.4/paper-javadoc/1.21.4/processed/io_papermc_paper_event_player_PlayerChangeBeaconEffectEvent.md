---
title: "io.papermc.paper.event.player.PlayerChangeBeaconEffectEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/player/PlayerChangeBeaconEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

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
