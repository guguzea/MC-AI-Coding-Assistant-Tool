---
title: "org.bukkit.event.entity.ArrowBodyCountChangeEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/ArrowBodyCountChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ArrowBodyCountChangeEvent**
`public class ArrowBodyCountChangeEvent extends EntityEvent implements Cancellable`
- `public ArrowBodyCountChangeEvent(@NotNull LivingEntity entity, int oldAmount, int newAmount, boolean isReset)`
- `public boolean isReset()`
- `public int getOldAmount()`
- `public int getNewAmount()`
- `public void setNewAmount(int newAmount)`
- `@NotNull public LivingEntity getEntity()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
