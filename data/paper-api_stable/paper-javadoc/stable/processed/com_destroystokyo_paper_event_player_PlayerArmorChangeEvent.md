---
title: "com.destroystokyo.paper.event.player.PlayerArmorChangeEvent"
package: "com.destroystokyo.paper.event.player"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/player/PlayerArmorChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerArmorChangeEvent**
`@NullMarked @Obsolete(since="1.21.4") public class PlayerArmorChangeEvent extends PlayerEvent`
- `@Internal public PlayerArmorChangeEvent(Player player, PlayerArmorChangeEvent.SlotType slotType, ItemStack oldItem, ItemStack newItem)`
- `@Deprecated(since="1.21.4") public PlayerArmorChangeEvent.SlotType getSlotType()`
- `public EquipmentSlot getSlot()`
- `public ItemStack getOldItem()`
- `public ItemStack getNewItem()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
