---
title: "org.bukkit.inventory.EntityEquipment"
package: "org.bukkit.inventory"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/EntityEquipment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface EntityEquipment**
`public interface EntityEquipment`
- `void setItem(@NotNull EquipmentSlot slot, @Nullable ItemStack item)`
- `void setItem(@NotNull EquipmentSlot slot, @Nullable ItemStack item, boolean silent)`
- `@NotNull ItemStack getItem(@NotNull EquipmentSlot slot)`
- `@NotNull ItemStack getItemInMainHand()`
- `void setItemInMainHand(@Nullable ItemStack item)`
- `void setItemInMainHand(@Nullable ItemStack item, boolean silent)`
- `@NotNull ItemStack getItemInOffHand()`
- `void setItemInOffHand(@Nullable ItemStack item)`
- `void setItemInOffHand(@Nullable ItemStack item, boolean silent)`
- `@Deprecated(since="1.9") @NotNull ItemStack getItemInHand()`
- `@Deprecated(since="1.9") void setItemInHand(@Nullable ItemStack stack)`
- `@Nullable ItemStack getHelmet()`
- `void setHelmet(@Nullable ItemStack helmet)`
- `void setHelmet(@Nullable ItemStack helmet, boolean silent)`
- `@Nullable ItemStack getChestplate()`
- `void setChestplate(@Nullable ItemStack chestplate)`
- `void setChestplate(@Nullable ItemStack chestplate, boolean silent)`
- `@Nullable ItemStack getLeggings()`
- `void setLeggings(@Nullable ItemStack leggings)`
- `void setLeggings(@Nullable ItemStack leggings, boolean silent)`
- `@Nullable ItemStack getBoots()`
- `void setBoots(@Nullable ItemStack boots)`
- `void setBoots(@Nullable ItemStack boots, boolean silent)`
- `@NotNull ItemStack[] getArmorContents()`
- `void setArmorContents(@NotNull ItemStack[] items)`
- `void clear()`
- `@Deprecated(since="1.9") float getItemInHandDropChance()`
- `@Deprecated(since="1.9") void setItemInHandDropChance(float chance)`
- `float getItemInMainHandDropChance()`
- `void setItemInMainHandDropChance(float chance)`
- `float getItemInOffHandDropChance()`
- `void setItemInOffHandDropChance(float chance)`
- `float getHelmetDropChance()`
- `void setHelmetDropChance(float chance)`
- `float getChestplateDropChance()`
- `void setChestplateDropChance(float chance)`
- `float getLeggingsDropChance()`
- `void setLeggingsDropChance(float chance)`
- `float getBootsDropChance()`
- `void setBootsDropChance(float chance)`
- `@Nullable Entity getHolder()`
