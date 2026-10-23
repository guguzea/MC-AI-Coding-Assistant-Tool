---
title: "org.bukkit.potion.Potion"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/potion/Potion.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public Potion&#8203;(@NotNull @NotNull PotionType type)`
- `public Potion&#8203;(@NotNull @NotNull PotionType type, int level)`
- `@Deprecated public Potion&#8203;(@NotNull @NotNull PotionType type, int level, boolean splash)`
- `@Deprecated public Potion&#8203;(@NotNull @NotNull PotionType type, int level, boolean splash, boolean extended)`
- `@NotNull public @NotNull Potion splash()`
- `@NotNull public @NotNull Potion extend()`
- `public void apply&#8203;(@NotNull @NotNull ItemStack to)`
- `public void apply&#8203;(@NotNull @NotNull LivingEntity to)`
- `public boolean equals&#8203;(Object obj)`
- `@NotNull public @NotNull Collection<PotionEffect> getEffects()`
- `public int getLevel()`
- `@NotNull public @NotNull PotionType getType()`
- `public boolean hasExtendedDuration()`
- `public int hashCode()`
- `public boolean isSplash()`
- `public void setHasExtendedDuration&#8203;(boolean isExtended)`
- `public void setSplash&#8203;(boolean isSplash)`
- `public void setType&#8203;(@NotNull @NotNull PotionType type)`
- `public void setLevel&#8203;(int level)`
- `@Deprecated public short toDamageValue()`
- `@NotNull public @NotNull ItemStack toItemStack&#8203;(int amount)`
- `@NotNull public static @NotNull Potion fromDamage&#8203;(int damage)`
- `@NotNull public static @NotNull Potion fromItemStack&#8203;(@NotNull @NotNull ItemStack item)`
- `@NotNull public static @NotNull PotionBrewer getBrewer()`
- `public static void setPotionBrewer&#8203;(@NotNull @NotNull PotionBrewer other)`
- `@Deprecated public int getNameId()`
