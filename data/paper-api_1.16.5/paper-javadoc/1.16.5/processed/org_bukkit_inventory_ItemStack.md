---
title: "org.bukkit.inventory.ItemStack"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/ItemStack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `protected ItemStack()`
- `public ItemStack&#8203;(@NotNull @NotNull Material type)`
- `public ItemStack&#8203;(@NotNull @NotNull Material type, int amount)`
- `public ItemStack&#8203;(@NotNull @NotNull Material type, int amount, short damage)`
- `@Deprecated public ItemStack&#8203;(@NotNull @NotNull Material type, int amount, short damage, @Nullable @Nullable Byte data)`
- `public ItemStack&#8203;(@NotNull @NotNull ItemStack stack) throws IllegalArgumentException`
- `@NotNull public @NotNull Material getType()`
- `public void setType&#8203;(@NotNull @NotNull Material type)`
- `public int getAmount()`
- `public void setAmount&#8203;(int amount)`
- `@Nullable public @Nullable MaterialData getData()`
- `public void setData&#8203;(@Nullable @Nullable MaterialData data)`
- `@Deprecated public void setDurability&#8203;(short durability)`
- `@Deprecated public short getDurability()`
- `public int getMaxStackSize()`
- `public String toString()`
- `public boolean equals&#8203;(Object obj)`
- `public boolean isSimilar&#8203;(@Nullable @Nullable ItemStack stack)`
- `@NotNull public @NotNull ItemStack clone()`
- `public int hashCode()`
- `public boolean containsEnchantment&#8203;(@NotNull @NotNull Enchantment ench)`
- `public int getEnchantmentLevel&#8203;(@NotNull @NotNull Enchantment ench)`
- `@NotNull public @NotNull Map<Enchantment,&#8203;Integer> getEnchantments()`
- `public void addEnchantments&#8203;(@NotNull @NotNull Map<Enchantment,&#8203;Integer> enchantments)`
- `public void addEnchantment&#8203;(@NotNull @NotNull Enchantment ench, int level)`
- `public void addUnsafeEnchantments&#8203;(@NotNull @NotNull Map<Enchantment,&#8203;Integer> enchantments)`
- `public void addUnsafeEnchantment&#8203;(@NotNull @NotNull Enchantment ench, int level)`
- `public int removeEnchantment&#8203;(@NotNull @NotNull Enchantment ench)`
- `@NotNull public @NotNull Map<String,&#8203;Object> serialize()`
- `@NotNull public static @NotNull ItemStack deserialize&#8203;(@NotNull @NotNull Map<String,&#8203;Object> args)`
- `public boolean editMeta&#8203;(@NotNull Consumer<? super ItemMeta> consumer)`
- `public ItemMeta getItemMeta()`
- `public boolean hasItemMeta()`
- `public boolean setItemMeta&#8203;(@Nullable @Nullable ItemMeta itemMeta)`
- `@NotNull public HoverEvent<HoverEvent.ShowItem> asHoverEvent&#8203;(@NotNull UnaryOperator<HoverEvent.ShowItem> op)`
- `@NotNull public Component displayName()`
- `@NotNull public @NotNull ItemStack ensureServerConversions()`
- `@NotNull public static @NotNull ItemStack deserializeBytes&#8203;(@NotNull @org.jetbrains.annotations.NotNull byte[] bytes)`
- `@NotNull public @org.jetbrains.annotations.NotNull byte[] serializeAsBytes()`
- `@Nullable public @Nullable String getI18NDisplayName()`
- `public int getMaxItemUseDuration()`
- `@NotNull public @NotNull ItemStack asOne()`
- `@NotNull public @NotNull ItemStack asQuantity&#8203;(int qty)`
- `@NotNull public @NotNull ItemStack add()`
- `@NotNull public @NotNull ItemStack add&#8203;(int qty)`
- `@NotNull public @NotNull ItemStack subtract()`
- `@NotNull public @NotNull ItemStack subtract&#8203;(int qty)`
- `@Deprecated @Nullable public @Nullable List<String> getLore()`
- `@Nullable public @Nullable List<Component> lore()`
- `@Deprecated public void setLore&#8203;(@Nullable @Nullable List<String> lore)`
- `public void lore&#8203;(@Nullable @Nullable List<Component> lore)`
- `public void addItemFlags&#8203;(@NotNull @NotNull ItemFlag... itemFlags)`
- `public void removeItemFlags&#8203;(@NotNull @NotNull ItemFlag... itemFlags)`
- `@NotNull public @NotNull Set<ItemFlag> getItemFlags()`
- `public boolean hasItemFlag&#8203;(@NotNull @NotNull ItemFlag flag)`
- `@NotNull public @NotNull String getTranslationKey()`
- `@NotNull public ItemRarity getRarity()`
- `public boolean isRepairableBy&#8203;(@NotNull @NotNull ItemStack repairMaterial)`
- `public boolean canRepair&#8203;(@NotNull @NotNull ItemStack toBeRepaired)`
