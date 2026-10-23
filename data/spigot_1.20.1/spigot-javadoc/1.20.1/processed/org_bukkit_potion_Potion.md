---
title: "org.bukkit.potion.Potion"
package: "org.bukkit.potion"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.potion.Potion`
- `public org.bukkit.potion.Potion(org.bukkit.potion.PotionType)`
- `public org.bukkit.potion.Potion(org.bukkit.potion.PotionType, int)`
- `public org.bukkit.potion.Potion(org.bukkit.potion.PotionType, int, boolean)`
- `public org.bukkit.potion.Potion(org.bukkit.potion.PotionType, int, boolean, boolean)`
- `public org.bukkit.potion.Potion splash()`
- `public org.bukkit.potion.Potion extend()`
- `public void apply(org.bukkit.inventory.ItemStack)`
- `public void apply(org.bukkit.entity.LivingEntity)`
- `public boolean equals(java.lang.Object)`
- `public java.util.Collection<org.bukkit.potion.PotionEffect> getEffects()`
- `public int getLevel()`
- `public org.bukkit.potion.PotionType getType()`
- `public boolean hasExtendedDuration()`
- `public int hashCode()`
- `public boolean isSplash()`
- `public void setHasExtendedDuration(boolean)`
- `public void setSplash(boolean)`
- `public void setType(org.bukkit.potion.PotionType)`
- `public void setLevel(int)`
- `public short toDamageValue()`
- `public org.bukkit.inventory.ItemStack toItemStack(int)`
- `public static org.bukkit.potion.Potion fromDamage(int)`
- `public static org.bukkit.potion.Potion fromItemStack(org.bukkit.inventory.ItemStack)`
- `public static org.bukkit.potion.PotionBrewer getBrewer()`
- `public static void setPotionBrewer(org.bukkit.potion.PotionBrewer)`
- `public int getNameId()`
