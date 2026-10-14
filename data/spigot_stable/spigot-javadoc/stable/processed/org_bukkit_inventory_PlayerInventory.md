---
title: "org.bukkit.inventory.PlayerInventory"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/PlayerInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PlayerInventory**
`public interface PlayerInventory extends Inventory`
- `@NotNull ItemStack[] getArmorContents()`
- `@NotNull ItemStack[] getExtraContents()`
- `@Nullable ItemStack getHelmet()`
- `@Nullable ItemStack getChestplate()`
- `@Nullable ItemStack getLeggings()`
- `@Nullable ItemStack getBoots()`
- `void setItem(int index, @Nullable ItemStack item)`
- `void setItem(@NotNull EquipmentSlot slot, @Nullable ItemStack item)`
- `@Nullable ItemStack getItem(@NotNull EquipmentSlot slot)`
- `void setArmorContents(@Nullable ItemStack[] items)`
- `void setExtraContents(@Nullable ItemStack[] items)`
- `void setHelmet(@Nullable ItemStack helmet)`
- `void setChestplate(@Nullable ItemStack chestplate)`
- `void setLeggings(@Nullable ItemStack leggings)`
- `void setBoots(@Nullable ItemStack boots)`
- `@NotNull ItemStack getItemInMainHand()`
- `void setItemInMainHand(@Nullable ItemStack item)`
- `@NotNull ItemStack getItemInOffHand()`
- `void setItemInOffHand(@Nullable ItemStack item)`
- `@Deprecated(since="1.9") @NotNull ItemStack getItemInHand()`
- `@Deprecated(since="1.9") void setItemInHand(@Nullable ItemStack stack)`
- `int getHeldItemSlot()`
- `void setHeldItemSlot(int slot)`
- `@Nullable HumanEntity getHolder()`
