---
title: "org.bukkit.event.entity.PigZapEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/PigZapEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PigZapEvent**
`public class PigZapEvent extends EntityTransformEvent implements Cancellable`
- `public PigZapEvent(@NotNull Pig pig, @NotNull LightningStrike bolt, @NotNull PigZombie pigzombie)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Pig getEntity()`
- `@NotNull public LightningStrike getLightning()`
- `@NotNull @Deprecated(since="1.13.2") public PigZombie getPigZombie()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
