---
title: "org.bukkit.event.player.PlayerStatisticIncrementEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
