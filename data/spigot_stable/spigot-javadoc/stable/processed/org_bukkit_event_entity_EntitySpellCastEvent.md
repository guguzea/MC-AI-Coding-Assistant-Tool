---
title: "org.bukkit.event.entity.EntitySpellCastEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/EntitySpellCastEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class EntitySpellCastEvent**
`public class EntitySpellCastEvent extends EntityEvent implements Cancellable`
- `public EntitySpellCastEvent(@NotNull Spellcaster what, @NotNull Spellcaster.Spell spell)`
- `@NotNull public Spellcaster getEntity()`
- `@NotNull public Spellcaster.Spell getSpell()`
- `public void setCancelled(boolean cancelled)`
- `public boolean isCancelled()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
