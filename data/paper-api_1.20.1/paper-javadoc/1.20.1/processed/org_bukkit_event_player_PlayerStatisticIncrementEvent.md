---
title: "org.bukkit.event.player.PlayerStatisticIncrementEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerStatisticIncrementEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `protected final Statistic statistic`
- `public PlayerStatisticIncrementEvent(@NotNull @NotNull Player player, @NotNull @NotNull Statistic statistic, int initialValue, int newValue)`
- `public PlayerStatisticIncrementEvent(@NotNull @NotNull Player player, @NotNull @NotNull Statistic statistic, int initialValue, int newValue, @NotNull @NotNull EntityType entityType)`
- `public PlayerStatisticIncrementEvent(@NotNull @NotNull Player player, @NotNull @NotNull Statistic statistic, int initialValue, int newValue, @NotNull @NotNull Material material)`
- `@NotNull public @NotNull Statistic getStatistic()`
- `public int getPreviousValue()`
- `public int getNewValue()`
- `@Nullable public @Nullable EntityType getEntityType()`
- `@Nullable public @Nullable Material getMaterial()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
