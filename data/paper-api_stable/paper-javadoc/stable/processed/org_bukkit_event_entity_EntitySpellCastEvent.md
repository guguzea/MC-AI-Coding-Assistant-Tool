---
title: "org.bukkit.event.entity.EntitySpellCastEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/EntitySpellCastEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class EntitySpellCastEvent**
`public class EntitySpellCastEvent extends EntityEvent implements Cancellable`
- `@Internal public EntitySpellCastEvent(@NotNull @NotNull Spellcaster spellcaster, @NotNull Spellcaster.Spell spell)`
- `@NotNull public @NotNull Spellcaster getEntity()`
- `@NotNull public Spellcaster.Spell getSpell()`
- `public void setCancelled(boolean cancel)`
- `public boolean isCancelled()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
