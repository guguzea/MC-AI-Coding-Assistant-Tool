---
title: "com.destroystokyo.paper.event.block.AnvilDamagedEvent"
package: "com.destroystokyo.paper.event.block"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/block/AnvilDamagedEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AnvilDamagedEvent**
`@NullMarked public class AnvilDamagedEvent extends InventoryEvent implements Cancellable`
- `@Internal public AnvilDamagedEvent(InventoryView inventory, @Nullable BlockData blockData)`
- `public AnvilInventory getInventory()`
- `public AnvilDamagedEvent.DamageState getDamageState()`
- `public void setDamageState(AnvilDamagedEvent.DamageState damageState)`
- `public boolean isBreaking()`
- `public void setBreaking(boolean breaking)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
