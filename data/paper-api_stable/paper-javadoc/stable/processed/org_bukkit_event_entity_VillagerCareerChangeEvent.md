---
title: "org.bukkit.event.entity.VillagerCareerChangeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/VillagerCareerChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VillagerCareerChangeEvent**
`public class VillagerCareerChangeEvent extends EntityEvent implements Cancellable`
- `@Internal public VillagerCareerChangeEvent(@NotNull @NotNull Villager villager, @NotNull @NotNull Villager.Profession profession, @NotNull @NotNull VillagerCareerChangeEvent.ChangeReason reason)`
- `@NotNull public @NotNull Villager getEntity()`
- `@NotNull public @NotNull Villager.Profession getProfession()`
- `public void setProfession(@NotNull @NotNull Villager.Profession profession)`
- `@NotNull public @NotNull VillagerCareerChangeEvent.ChangeReason getReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
