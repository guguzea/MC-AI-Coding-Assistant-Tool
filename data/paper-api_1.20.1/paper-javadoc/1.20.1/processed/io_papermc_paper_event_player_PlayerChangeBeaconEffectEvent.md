---
title: "io.papermc.paper.event.player.PlayerChangeBeaconEffectEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerChangeBeaconEffectEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Internal public PlayerChangeBeaconEffectEvent(@NotNull @NotNull Player player, @Nullable @Nullable PotionEffectType primary, @Nullable @Nullable PotionEffectType secondary, @NotNull @NotNull Block beacon)`
- `@Nullable public @Nullable PotionEffectType getPrimary()`
- `public void setPrimary(@Nullable @Nullable PotionEffectType primary)`
- `@Nullable public @Nullable PotionEffectType getSecondary()`
- `public void setSecondary(@Nullable @Nullable PotionEffectType secondary)`
- `@NotNull public @NotNull Block getBeacon()`
- `public boolean willConsumeItem()`
- `public void setConsumeItem(boolean consumeItem)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
