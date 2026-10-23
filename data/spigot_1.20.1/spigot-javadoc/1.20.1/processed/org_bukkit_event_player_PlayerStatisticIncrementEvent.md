---
title: "org.bukkit.event.player.PlayerStatisticIncrementEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
