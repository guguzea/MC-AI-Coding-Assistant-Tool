---
title: "org.bukkit.potion.Potion"
package: "org.bukkit.potion"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
