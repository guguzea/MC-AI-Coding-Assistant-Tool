---
title: "org.bukkit.event.player.PlayerStatisticIncrementEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.event.player.PlayerStatisticIncrementEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `protected final org.bukkit.Statistic statistic`
- `public org.bukkit.event.player.PlayerStatisticIncrementEvent(org.bukkit.entity.Player, org.bukkit.Statistic, int, int)`
- `public org.bukkit.event.player.PlayerStatisticIncrementEvent(org.bukkit.entity.Player, org.bukkit.Statistic, int, int, org.bukkit.entity.EntityType)`
- `public org.bukkit.event.player.PlayerStatisticIncrementEvent(org.bukkit.entity.Player, org.bukkit.Statistic, int, int, org.bukkit.Material)`
- `public org.bukkit.Statistic getStatistic()`
- `public int getPreviousValue()`
- `public int getNewValue()`
- `public org.bukkit.entity.EntityType getEntityType()`
- `public org.bukkit.Material getMaterial()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
