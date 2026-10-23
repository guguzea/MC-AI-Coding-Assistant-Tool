---
title: "org.bukkit.potion.PotionType"
package: "org.bukkit.potion"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public final class org.bukkit.potion.PotionType extends java.lang.Enum<org.bukkit.potion.PotionType> implements org.bukkit.Keyed, org.bukkit.registry.RegistryAware`
- 枚举常量：`WATER` · `MUNDANE` · `THICK` · `AWKWARD` · `NIGHT_VISION` · `LONG_NIGHT_VISION` · `INVISIBILITY` · `LONG_INVISIBILITY` · `LEAPING` · `LONG_LEAPING` · `STRONG_LEAPING` · `FIRE_RESISTANCE` · `LONG_FIRE_RESISTANCE` · `SWIFTNESS` · `LONG_SWIFTNESS` · `STRONG_SWIFTNESS` · `SLOWNESS` · `LONG_SLOWNESS` · `STRONG_SLOWNESS` · `WATER_BREATHING` · `LONG_WATER_BREATHING` · `HEALING` · `STRONG_HEALING` · `HARMING` · `STRONG_HARMING` · `POISON` · `LONG_POISON` · `STRONG_POISON` · `REGENERATION` · `LONG_REGENERATION` · `STRONG_REGENERATION` · `STRENGTH` · `LONG_STRENGTH` · `STRONG_STRENGTH` · `WEAKNESS` · `LONG_WEAKNESS` · `LUCK` · `TURTLE_MASTER` · `LONG_TURTLE_MASTER` · `STRONG_TURTLE_MASTER` · `SLOW_FALLING` · `LONG_SLOW_FALLING` · `WIND_CHARGED` · `WEAVING` · `OOZING` · `INFESTED`
- `public static org.bukkit.potion.PotionType[] values()`
- `public static org.bukkit.potion.PotionType valueOf(java.lang.String)`
- `public org.bukkit.potion.PotionEffectType getEffectType()`
- `public java.util.List<org.bukkit.potion.PotionEffect> getPotionEffects()`
- `public boolean isInstant()`
- `public boolean isUpgradeable()`
- `public boolean isExtendable()`
- `public int getMaxLevel()`
- `public org.bukkit.NamespacedKey getKeyOrThrow()`
- `public org.bukkit.NamespacedKey getKeyOrNull()`
- `public boolean isRegistered()`
- `public static org.bukkit.potion.PotionType getByEffect(org.bukkit.potion.PotionEffectType)`
- `public org.bukkit.NamespacedKey getKey()`
