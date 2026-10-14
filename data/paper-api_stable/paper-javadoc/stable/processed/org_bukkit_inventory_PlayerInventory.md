---
title: "org.bukkit.inventory.PlayerInventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/PlayerInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PlayerInventory**
`public interface PlayerInventory extends Inventory`
- `@Nullable @Nullable ItemStack @NotNull [] getArmorContents()`
- `@Nullable @Nullable ItemStack @NotNull [] getExtraContents()`
- `@NotNull @NotNull ItemStack getHelmet()`
- `@NotNull @NotNull ItemStack getChestplate()`
- `@NotNull @NotNull ItemStack getLeggings()`
- `@NotNull @NotNull ItemStack getBoots()`
- `void setItem(int index, @Nullable @Nullable ItemStack item)`
- `void setItem(@NotNull @NotNull EquipmentSlot slot, @Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack getItem(@NotNull @NotNull EquipmentSlot slot)`
- `void setArmorContents(@Nullable @Nullable ItemStack @NotNull [] items)`
- `void setExtraContents(@Nullable @Nullable ItemStack @NotNull [] items)`
- `void setHelmet(@Nullable @Nullable ItemStack helmet)`
- `void setChestplate(@Nullable @Nullable ItemStack chestplate)`
- `void setLeggings(@Nullable @Nullable ItemStack leggings)`
- `void setBoots(@Nullable @Nullable ItemStack boots)`
- `@NotNull @NotNull ItemStack getItemInMainHand()`
- `void setItemInMainHand(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack getItemInOffHand()`
- `void setItemInOffHand(@Nullable @Nullable ItemStack item)`
- `@Deprecated(since="1.9") @NotNull @NotNull ItemStack getItemInHand()`
- `@Deprecated(since="1.9") void setItemInHand(@Nullable @Nullable ItemStack stack)`
- `int getHeldItemSlot()`
- `void setHeldItemSlot(int slot)`
- `@Nullable @Nullable HumanEntity getHolder()`
