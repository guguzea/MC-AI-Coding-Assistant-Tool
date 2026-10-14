---
title: "org.bukkit.event.entity.VillagerCareerChangeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/VillagerCareerChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class VillagerCareerChangeEvent**
`public class VillagerCareerChangeEvent extends EntityEvent implements Cancellable`
- `public VillagerCareerChangeEvent(@NotNull Villager what, @NotNull Villager.Profession profession, @NotNull VillagerCareerChangeEvent.ChangeReason reason)`
- `@NotNull public Villager getEntity()`
- `@NotNull public Villager.Profession getProfession()`
- `public void setProfession(@NotNull Villager.Profession profession)`
- `@NotNull public VillagerCareerChangeEvent.ChangeReason getReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
