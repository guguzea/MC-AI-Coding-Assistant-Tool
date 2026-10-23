---
title: "org.bukkit.potion.Potion"
package: "org.bukkit.potion"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/potion/Potion.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `void apply(LivingEntity to)`
- `void apply(ItemStack to)`
- `boolean equals(Object obj)`
- `Potion extend()`
- `static Potion fromDamage(int damage)`
- `static Potion fromItemStack(ItemStack item)`
- `static PotionBrewer getBrewer()`
- `Collection<PotionEffect> getEffects()`
- `int getLevel()`
- `int getNameId()`
- `PotionType getType()`
- `boolean hasExtendedDuration()`
- `int hashCode()`
- `boolean isSplash()`
- `void setHasExtendedDuration(boolean isExtended)`
- `void setLevel(int level)`
- `static void setPotionBrewer(PotionBrewer other)`
- `void setSplash(boolean isSplash)`
- `void setType(PotionType type)`
- `Potion splash()`
- `short toDamageValue()`
- `ItemStack toItemStack(int amount)`
