---
title: "org.bukkit.event.entity.HorseJumpEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/HorseJumpEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class HorseJumpEvent**
`public class HorseJumpEvent extends EntityEvent implements Cancellable`
- `@Internal public HorseJumpEvent(@NotNull @NotNull AbstractHorse horse, float power)`
- `@NotNull public @NotNull AbstractHorse getEntity()`
- `public float getPower()`
- `@Deprecated(since="1.9") public void setPower(float power)`
- `public boolean isCancelled()`
- `@Deprecated(since="1.9") public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
