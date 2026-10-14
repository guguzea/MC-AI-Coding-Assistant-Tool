---
title: "org.bukkit.event.player.PlayerStatisticIncrementEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerStatisticIncrementEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerStatisticIncrementEvent**
`public class PlayerStatisticIncrementEvent extends PlayerEvent implements Cancellable`
- `protected final Statistic statistic`
- `@Internal public PlayerStatisticIncrementEvent(@NotNull @NotNull Player player, @NotNull @NotNull Statistic statistic, int initialValue, int newValue)`
- `@Internal public PlayerStatisticIncrementEvent(@NotNull @NotNull Player player, @NotNull @NotNull Statistic statistic, int initialValue, int newValue, @NotNull @NotNull EntityType entityType)`
- `@Internal public PlayerStatisticIncrementEvent(@NotNull @NotNull Player player, @NotNull @NotNull Statistic statistic, int initialValue, int newValue, @NotNull @NotNull Material material)`
- `@NotNull public @NotNull Statistic getStatistic()`
- `public int getPreviousValue()`
- `public int getNewValue()`
- `@Nullable public @Nullable EntityType getEntityType()`
- `@Nullable public @Nullable Material getMaterial()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
