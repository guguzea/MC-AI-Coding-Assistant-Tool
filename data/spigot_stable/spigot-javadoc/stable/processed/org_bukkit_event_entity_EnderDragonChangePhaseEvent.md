---
title: "org.bukkit.event.entity.EnderDragonChangePhaseEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EnderDragonChangePhaseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EnderDragonChangePhaseEvent**
`public class EnderDragonChangePhaseEvent extends EntityEvent implements Cancellable`
- `public EnderDragonChangePhaseEvent(@NotNull EnderDragon enderDragon, @Nullable EnderDragon.Phase currentPhase, @NotNull EnderDragon.Phase newPhase)`
- `@NotNull public EnderDragon getEntity()`
- `@Nullable public EnderDragon.Phase getCurrentPhase()`
- `@NotNull public EnderDragon.Phase getNewPhase()`
- `public void setNewPhase(@NotNull EnderDragon.Phase newPhase)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
