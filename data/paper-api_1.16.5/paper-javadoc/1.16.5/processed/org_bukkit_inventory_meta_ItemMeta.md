---
title: "org.bukkit.inventory.meta.ItemMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/meta/ItemMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `boolean hasDisplayName()`
- `@Nullable Component displayName()`
- `void displayName&#8203;(@Nullable Component displayName)`
- `@Deprecated @NotNull @NotNull String getDisplayName()`
- `@NotNull @Deprecated @NotNull BaseComponent[] getDisplayNameComponent()`
- `@Deprecated void setDisplayName&#8203;(@Nullable @Nullable String name)`
- `@Deprecated void setDisplayNameComponent&#8203;(@Nullable @Nullable BaseComponent[] component)`
- `boolean hasLocalizedName()`
- `@NotNull @NotNull String getLocalizedName()`
- `void setLocalizedName&#8203;(@Nullable @Nullable String name)`
- `boolean hasLore()`
- `@Nullable @Nullable List<Component> lore()`
- `void lore&#8203;(@Nullable @Nullable List<Component> lore)`
- `@Deprecated @Nullable @Nullable List<String> getLore()`
- `@Nullable @Deprecated @Nullable List<BaseComponent[]> getLoreComponents()`
- `@Deprecated void setLore&#8203;(@Nullable @Nullable List<String> lore)`
- `@Deprecated void setLoreComponents&#8203;(@Nullable @Nullable List<BaseComponent[]> lore)`
- `boolean hasCustomModelData()`
- `int getCustomModelData()`
- `void setCustomModelData&#8203;(@Nullable @Nullable Integer data)`
- `boolean hasEnchants()`
- `boolean hasEnchant&#8203;(@NotNull @NotNull Enchantment ench)`
- `int getEnchantLevel&#8203;(@NotNull @NotNull Enchantment ench)`
- `@NotNull @NotNull Map<Enchantment,&#8203;Integer> getEnchants()`
- `boolean addEnchant&#8203;(@NotNull @NotNull Enchantment ench, int level, boolean ignoreLevelRestriction)`
- `boolean removeEnchant&#8203;(@NotNull @NotNull Enchantment ench)`
- `boolean hasConflictingEnchant&#8203;(@NotNull @NotNull Enchantment ench)`
- `void addItemFlags&#8203;(@NotNull @NotNull ItemFlag... itemFlags)`
- `void removeItemFlags&#8203;(@NotNull @NotNull ItemFlag... itemFlags)`
- `@NotNull @NotNull Set<ItemFlag> getItemFlags()`
- `boolean hasItemFlag&#8203;(@NotNull @NotNull ItemFlag flag)`
- `boolean isUnbreakable()`
- `void setUnbreakable&#8203;(boolean unbreakable)`
- `boolean hasAttributeModifiers()`
- `@Nullable @Nullable Multimap<Attribute,&#8203;AttributeModifier> getAttributeModifiers()`
- `@NotNull @NotNull Multimap<Attribute,&#8203;AttributeModifier> getAttributeModifiers&#8203;(@NotNull @NotNull EquipmentSlot slot)`
- `@Nullable @Nullable Collection<AttributeModifier> getAttributeModifiers&#8203;(@NotNull @NotNull Attribute attribute)`
- `boolean addAttributeModifier&#8203;(@NotNull @NotNull Attribute attribute, @NotNull @NotNull AttributeModifier modifier)`
- `void setAttributeModifiers&#8203;(@Nullable @Nullable Multimap<Attribute,&#8203;AttributeModifier> attributeModifiers)`
- `boolean removeAttributeModifier&#8203;(@NotNull @NotNull Attribute attribute)`
- `boolean removeAttributeModifier&#8203;(@NotNull @NotNull EquipmentSlot slot)`
- `boolean removeAttributeModifier&#8203;(@NotNull @NotNull Attribute attribute, @NotNull @NotNull AttributeModifier modifier)`
- `@NotNull @Deprecated @NotNull CustomItemTagContainer getCustomTagContainer()`
- `@Deprecated void setVersion&#8203;(int version)`
- `@NotNull @NotNull ItemMeta clone()`
- `@Deprecated Set<Material> getCanDestroy()`
- `@Deprecated void setCanDestroy&#8203;(Set<Material> canDestroy)`
- `@Deprecated Set<Material> getCanPlaceOn()`
- `@Deprecated void setCanPlaceOn&#8203;(Set<Material> canPlaceOn)`
- `@NotNull @NotNull Set<Namespaced> getDestroyableKeys()`
- `void setDestroyableKeys&#8203;(@NotNull @NotNull Collection<Namespaced> canDestroy)`
- `@NotNull @NotNull Set<Namespaced> getPlaceableKeys()`
- `@NotNull void setPlaceableKeys&#8203;(@NotNull @NotNull Collection<Namespaced> canPlaceOn)`
- `boolean hasPlaceableKeys()`
- `boolean hasDestroyableKeys()`
