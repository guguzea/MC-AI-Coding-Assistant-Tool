---
title: "org.bukkit.inventory.meta.ItemMeta"
package: "org.bukkit.inventory.meta"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/inventory/meta/ItemMeta.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `boolean hasDisplayName()`
- `@Nullable Component displayName()`
- `void displayName(@Nullable Component displayName)`
- `@Deprecated @NotNull @NotNull String getDisplayName()`
- `@NotNull @Deprecated @NotNull net.md_5.bungee.api.chat.BaseComponent[] getDisplayNameComponent()`
- `@Deprecated void setDisplayName(@Nullable @Nullable String name)`
- `@Deprecated void setDisplayNameComponent(@Nullable @Nullable net.md_5.bungee.api.chat.BaseComponent[] component)`
- `@Deprecated boolean hasLocalizedName()`
- `@Deprecated @NotNull @NotNull String getLocalizedName()`
- `@Deprecated void setLocalizedName(@Nullable @Nullable String name)`
- `boolean hasLore()`
- `@Nullable @Nullable List<Component> lore()`
- `void lore(@Nullable @Nullable List<? extends Component> lore)`
- `@Deprecated @Nullable @Nullable List<String> getLore()`
- `@Nullable @Deprecated @Nullable List<net.md_5.bungee.api.chat.BaseComponent[]> getLoreComponents()`
- `@Deprecated void setLore(@Nullable @Nullable List<String> lore)`
- `@Deprecated void setLoreComponents(@Nullable @Nullable List<net.md_5.bungee.api.chat.BaseComponent[]> lore)`
- `boolean hasCustomModelData()`
- `int getCustomModelData()`
- `void setCustomModelData(@Nullable @Nullable Integer data)`
- `boolean hasEnchants()`
- `boolean hasEnchant(@NotNull @NotNull Enchantment ench)`
- `int getEnchantLevel(@NotNull @NotNull Enchantment ench)`
- `@NotNull @NotNull Map<Enchantment,Integer> getEnchants()`
- `boolean addEnchant(@NotNull @NotNull Enchantment ench, int level, boolean ignoreLevelRestriction)`
- `boolean removeEnchant(@NotNull @NotNull Enchantment ench)`
- `boolean hasConflictingEnchant(@NotNull @NotNull Enchantment ench)`
- `void addItemFlags(@NotNull @NotNull ItemFlag... itemFlags)`
- `void removeItemFlags(@NotNull @NotNull ItemFlag... itemFlags)`
- `@NotNull @NotNull Set<ItemFlag> getItemFlags()`
- `boolean hasItemFlag(@NotNull @NotNull ItemFlag flag)`
- `boolean isUnbreakable()`
- `void setUnbreakable(boolean unbreakable)`
- `boolean hasAttributeModifiers()`
- `@Nullable @Nullable Multimap<Attribute,AttributeModifier> getAttributeModifiers()`
- `@NotNull @NotNull Multimap<Attribute,AttributeModifier> getAttributeModifiers(@NotNull @NotNull EquipmentSlot slot)`
- `@Nullable @Nullable Collection<AttributeModifier> getAttributeModifiers(@NotNull @NotNull Attribute attribute)`
- `boolean addAttributeModifier(@NotNull @NotNull Attribute attribute, @NotNull @NotNull AttributeModifier modifier)`
- `void setAttributeModifiers(@Nullable @Nullable Multimap<Attribute,AttributeModifier> attributeModifiers)`
- `boolean removeAttributeModifier(@NotNull @NotNull Attribute attribute)`
- `boolean removeAttributeModifier(@NotNull @NotNull EquipmentSlot slot)`
- `boolean removeAttributeModifier(@NotNull @NotNull Attribute attribute, @NotNull @NotNull AttributeModifier modifier)`
- `@NotNull @NotNull String getAsString()`
- `@NotNull @Deprecated @NotNull CustomItemTagContainer getCustomTagContainer()`
- `@Deprecated void setVersion(int version)`
- `@NotNull @NotNull ItemMeta clone()`
- `@Deprecated Set<Material> getCanDestroy()`
- `@Deprecated void setCanDestroy(Set<Material> canDestroy)`
- `@Deprecated Set<Material> getCanPlaceOn()`
- `@Deprecated void setCanPlaceOn(Set<Material> canPlaceOn)`
- `@NotNull @NotNull Set<Namespaced> getDestroyableKeys()`
- `void setDestroyableKeys(@NotNull @NotNull Collection<Namespaced> canDestroy)`
- `@NotNull @NotNull Set<Namespaced> getPlaceableKeys()`
- `@NotNull void setPlaceableKeys(@NotNull @NotNull Collection<Namespaced> canPlaceOn)`
- `boolean hasPlaceableKeys()`
- `boolean hasDestroyableKeys()`
