---
title: "io.papermc.paper.event.player.PlayerChangeBeaconEffectEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/player/PlayerChangeBeaconEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerChangeBeaconEffectEvent&#8203;(@NotNull @NotNull Player player, @Nullable @Nullable PotionEffectType primary, @Nullable @Nullable PotionEffectType secondary, @Nullable @Nullable Block beacon)`
- `@Nullable public @Nullable PotionEffectType getPrimary()`
- `public void setPrimary&#8203;(@Nullable @Nullable PotionEffectType primary)`
- `@Nullable public @Nullable PotionEffectType getSecondary()`
- `public void setSecondary&#8203;(@Nullable @Nullable PotionEffectType secondary)`
- `@Nullable public @Nullable Block getBeacon()`
- `public boolean willConsumeItem()`
- `public void setConsumeItem&#8203;(boolean consumeItem)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
