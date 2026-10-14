---
title: "org.bukkit.event.entity.PigZombieAngerEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/PigZombieAngerEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PigZombieAngerEvent**
`public class PigZombieAngerEvent extends EntityEvent implements Cancellable`
- `@Internal public PigZombieAngerEvent(@NotNull @NotNull PigZombie zombifiedPiglin, @Nullable @Nullable Entity target, int newAnger)`
- `@Nullable public @Nullable Entity getTarget()`
- `public int getNewAnger()`
- `public void setNewAnger(int newAnger)`
- `@NotNull public @NotNull PigZombie getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
