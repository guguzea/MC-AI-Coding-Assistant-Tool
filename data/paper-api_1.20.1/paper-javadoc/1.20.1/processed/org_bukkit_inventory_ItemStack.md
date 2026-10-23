---
title: "org.bukkit.inventory.ItemStack"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/inventory/ItemStack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `protected ItemStack()`
- `public ItemStack(@NotNull @NotNull Material type)`
- `public ItemStack(@NotNull @NotNull Material type, int amount)`
- `@Deprecated public ItemStack(@NotNull @NotNull Material type, int amount, short damage)`
- `@Deprecated public ItemStack(@NotNull @NotNull Material type, int amount, short damage, @Nullable @Nullable Byte data)`
- `public ItemStack(@NotNull @NotNull ItemStack stack) throws IllegalArgumentException`
- `@NotNull public @NotNull Material getType()`
- `public void setType(@NotNull @NotNull Material type)`
- `public int getAmount()`
- `public void setAmount(int amount)`
- `@Nullable @Deprecated public @Nullable MaterialData getData()`
- `@Deprecated public void setData(@Nullable @Nullable MaterialData data)`
- `@Deprecated public void setDurability(short durability)`
- `@Deprecated public short getDurability()`
- `public int getMaxStackSize()`
- `public String toString()`
- `public boolean equals(Object obj)`
- `public boolean isSimilar(@Nullable @Nullable ItemStack stack)`
- `@NotNull public @NotNull ItemStack clone()`
- `public int hashCode()`
- `public boolean containsEnchantment(@NotNull @NotNull Enchantment ench)`
- `public int getEnchantmentLevel(@NotNull @NotNull Enchantment ench)`
- `@NotNull public @NotNull Map<Enchantment,Integer> getEnchantments()`
- `public void addEnchantments(@NotNull @NotNull Map<Enchantment,Integer> enchantments)`
- `public void addEnchantment(@NotNull @NotNull Enchantment ench, int level)`
- `public void addUnsafeEnchantments(@NotNull @NotNull Map<Enchantment,Integer> enchantments)`
- `public void addUnsafeEnchantment(@NotNull @NotNull Enchantment ench, int level)`
- `public int removeEnchantment(@NotNull @NotNull Enchantment ench)`
- `@NotNull public @NotNull Map<String,Object> serialize()`
- `@NotNull public static @NotNull ItemStack deserialize(@NotNull @NotNull Map<String,Object> args)`
- `public boolean editMeta(@NotNull Consumer<? super ItemMeta> consumer)`
- `public <M extends ItemMeta> boolean editMeta(@NotNull @NotNull Class<M> metaClass, @NotNull Consumer<@NotNull ? super M> consumer)`
- `@UndefinedNullability public ItemMeta getItemMeta()`
- `public boolean hasItemMeta()`
- `public boolean setItemMeta(@Nullable @Nullable ItemMeta itemMeta)`
- `@NotNull @Deprecated(forRemoval=true) public @NotNull String getTranslationKey()`
- `@NotNull public @NotNull ItemStack enchantWithLevels(@org.jetbrains.annotations.Range(from=1L, to=30L) int levels, boolean allowTreasure, @NotNull Random random)`
- `@NotNull public HoverEvent<HoverEvent.ShowItem> asHoverEvent(@NotNull UnaryOperator<HoverEvent.ShowItem> op)`
- `public @NotNull Component displayName()`
- `@NotNull public @NotNull ItemStack ensureServerConversions()`
- `@NotNull public static @NotNull ItemStack deserializeBytes(@NotNull @org.jetbrains.annotations.NotNull byte[] bytes)`
- `@NotNull public @org.jetbrains.annotations.NotNull byte[] serializeAsBytes()`
- `@Nullable @Deprecated public @Nullable String getI18NDisplayName()`
- `public int getMaxItemUseDuration()`
- `@NotNull public @NotNull ItemStack asOne()`
- `@NotNull public @NotNull ItemStack asQuantity(int qty)`
- `@NotNull public @NotNull ItemStack add()`
- `@NotNull public @NotNull ItemStack add(int qty)`
- `@NotNull public @NotNull ItemStack subtract()`
- `@NotNull public @NotNull ItemStack subtract(int qty)`
- `@Deprecated @Nullable public @Nullable List<String> getLore()`
- `@Nullable public @Nullable List<Component> lore()`
- `@Deprecated public void setLore(@Nullable @Nullable List<String> lore)`
- `public void lore(@Nullable @Nullable List<? extends Component> lore)`
- `public void addItemFlags(@NotNull @NotNull ItemFlag... itemFlags)`
- `public void removeItemFlags(@NotNull @NotNull ItemFlag... itemFlags)`
- `@NotNull public Set<ItemFlag> getItemFlags()`
- `public boolean hasItemFlag(@NotNull @NotNull ItemFlag flag)`
- `@NotNull public @NotNull String translationKey()`
- `@NotNull public ItemRarity getRarity()`
- `public boolean isRepairableBy(@NotNull @NotNull ItemStack repairMaterial)`
- `public boolean canRepair(@NotNull @NotNull ItemStack toBeRepaired)`
- `@NotNull public @NotNull ItemStack damage(int amount, @NotNull LivingEntity livingEntity)`
- `@NotNull public static @NotNull ItemStack empty()`
- `public boolean isEmpty()`
