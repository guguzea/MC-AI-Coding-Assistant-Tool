---
title: "org.bukkit.potion.Potion"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/potion/Potion.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public Potion(@NotNull @NotNull PotionType type)`
- `public Potion(@NotNull @NotNull PotionType type, int level)`
- `@Deprecated public Potion(@NotNull @NotNull PotionType type, int level, boolean splash)`
- `@Deprecated public Potion(@NotNull @NotNull PotionType type, int level, boolean splash, boolean extended)`
- `@NotNull public @NotNull Potion splash()`
- `@NotNull public @NotNull Potion extend()`
- `public void apply(@NotNull @NotNull ItemStack to)`
- `public void apply(@NotNull @NotNull LivingEntity to)`
- `public boolean equals(Object obj)`
- `@NotNull public @NotNull Collection<PotionEffect> getEffects()`
- `public int getLevel()`
- `@NotNull public @NotNull PotionType getType()`
- `public boolean hasExtendedDuration()`
- `public int hashCode()`
- `public boolean isSplash()`
- `public void setHasExtendedDuration(boolean isExtended)`
- `public void setSplash(boolean isSplash)`
- `public void setType(@NotNull @NotNull PotionType type)`
- `public void setLevel(int level)`
- `@Deprecated public short toDamageValue()`
- `@NotNull public @NotNull ItemStack toItemStack(int amount)`
- `@NotNull public static @NotNull Potion fromDamage(int damage)`
- `@NotNull public static @NotNull Potion fromItemStack(@NotNull @NotNull ItemStack item)`
- `@NotNull public static @NotNull PotionBrewer getBrewer()`
- `public static void setPotionBrewer(@NotNull @NotNull PotionBrewer other)`
- `@Deprecated public int getNameId()`
