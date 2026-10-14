---
title: "org.bukkit.event.entity.VillagerReputationChangeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/VillagerReputationChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class VillagerReputationChangeEvent**
`public class VillagerReputationChangeEvent extends EntityEvent implements Cancellable`
- `public VillagerReputationChangeEvent(@NotNull Villager villager, @NotNull UUID targetUUID, @NotNull Villager.ReputationEvent reason, @NotNull Villager.ReputationType reputationType, int oldValue, int newValue, int maxValue)`
- `@NotNull public UUID getTargetUUID()`
- `@Nullable public Entity getTarget()`
- `@NotNull public Villager.ReputationEvent getReason()`
- `@NotNull public Villager.ReputationType getReputationType()`
- `public int getOldValue()`
- `public int getNewValue()`
- `public void setNewValue(int newValue)`
- `public int getMaxValue()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Villager getEntity()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
