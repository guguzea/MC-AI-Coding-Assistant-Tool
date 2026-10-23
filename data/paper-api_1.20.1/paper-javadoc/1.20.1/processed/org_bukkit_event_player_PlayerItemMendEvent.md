---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/player/PlayerItemMendEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerItemMendEvent(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@Internal public PlayerItemMendEvent(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount, @NotNull IntUnaryOperator durabilityToXpOp)`
- `@Deprecated public PlayerItemMendEvent(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@NotNull public IntUnaryOperator getDurabilityToXpOperation()`
- `public void setDurabilityToXpOperation(@NotNull IntUnaryOperator durabilityToXpOp)`
- `public int getConsumedExperience()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull EquipmentSlot getSlot()`
- `@NotNull public @NotNull ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount(int amount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
