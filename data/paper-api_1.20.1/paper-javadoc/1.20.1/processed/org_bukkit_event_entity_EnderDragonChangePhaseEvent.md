---
title: "org.bukkit.event.entity.EnderDragonChangePhaseEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EnderDragonChangePhaseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EnderDragonChangePhaseEvent(@NotNull @NotNull EnderDragon enderDragon, @Nullable EnderDragon.Phase currentPhase, @NotNull EnderDragon.Phase newPhase)`
- `@NotNull public @NotNull EnderDragon getEntity()`
- `@Nullable public EnderDragon.Phase getCurrentPhase()`
- `@NotNull public EnderDragon.Phase getNewPhase()`
- `public void setNewPhase(@NotNull EnderDragon.Phase newPhase)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
