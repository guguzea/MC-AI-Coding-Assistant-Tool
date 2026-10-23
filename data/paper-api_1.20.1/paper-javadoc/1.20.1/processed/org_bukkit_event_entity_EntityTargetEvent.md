---
title: "org.bukkit.event.entity.EntityTargetEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityTargetEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityTargetEvent(@NotNull @NotNull Entity entity, @Nullable @Nullable Entity target, @NotNull @NotNull EntityTargetEvent.TargetReason reason)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull EntityTargetEvent.TargetReason getReason()`
- `@Nullable public @Nullable Entity getTarget()`
- `public void setTarget(@Nullable @Nullable Entity target)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
