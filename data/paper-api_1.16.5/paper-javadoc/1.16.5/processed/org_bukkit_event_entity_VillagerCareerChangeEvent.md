---
title: "org.bukkit.event.entity.VillagerCareerChangeEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/VillagerCareerChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public VillagerCareerChangeEvent&#8203;(@NotNull @NotNull Villager what, @NotNull @NotNull Villager.Profession profession, @NotNull @NotNull VillagerCareerChangeEvent.ChangeReason reason)`
- `@NotNull public @NotNull Villager getEntity()`
- `@NotNull public @NotNull Villager.Profession getProfession()`
- `public void setProfession&#8203;(@NotNull @NotNull Villager.Profession profession)`
- `@NotNull public @NotNull VillagerCareerChangeEvent.ChangeReason getReason()`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(@NotNull @org.jetbrains.annotations.NotNull boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
