---
title: "org.bukkit.event.player.PlayerStatisticIncrementEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerStatisticIncrementEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerStatisticIncrementEvent**
`public class PlayerStatisticIncrementEvent extends PlayerEvent implements Cancellable`
- `protected final Statistic statistic`
- `public PlayerStatisticIncrementEvent(@NotNull Player player, @NotNull Statistic statistic, int initialValue, int newValue)`
- `public PlayerStatisticIncrementEvent(@NotNull Player player, @NotNull Statistic statistic, int initialValue, int newValue, @NotNull EntityType entityType)`
- `public PlayerStatisticIncrementEvent(@NotNull Player player, @NotNull Statistic statistic, int initialValue, int newValue, @NotNull Material material)`
- `@NotNull public Statistic getStatistic()`
- `public int getPreviousValue()`
- `public int getNewValue()`
- `@Nullable public EntityType getEntityType()`
- `@Nullable public Material getMaterial()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
