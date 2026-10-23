---
title: "org.bukkit.event.entity.VillagerCareerChangeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/VillagerCareerChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public VillagerCareerChangeEvent(@NotNull @NotNull Villager what, @NotNull @NotNull Villager.Profession profession, @NotNull @NotNull VillagerCareerChangeEvent.ChangeReason reason)`
- `@NotNull public @NotNull Villager getEntity()`
- `@NotNull public @NotNull Villager.Profession getProfession()`
- `public void setProfession(@NotNull @NotNull Villager.Profession profession)`
- `@NotNull public @NotNull VillagerCareerChangeEvent.ChangeReason getReason()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
