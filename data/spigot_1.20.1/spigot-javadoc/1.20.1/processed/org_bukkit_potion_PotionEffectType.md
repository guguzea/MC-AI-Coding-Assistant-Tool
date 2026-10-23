---
title: "org.bukkit.potion.PotionEffectType"
package: "org.bukkit.potion"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public abstract class org.bukkit.potion.PotionEffectType implements org.bukkit.Keyed`
- `public static final org.bukkit.potion.PotionEffectType SPEED`
- `public static final org.bukkit.potion.PotionEffectType SLOW`
- `public static final org.bukkit.potion.PotionEffectType FAST_DIGGING`
- `public static final org.bukkit.potion.PotionEffectType SLOW_DIGGING`
- `public static final org.bukkit.potion.PotionEffectType INCREASE_DAMAGE`
- `public static final org.bukkit.potion.PotionEffectType HEAL`
- `public static final org.bukkit.potion.PotionEffectType HARM`
- `public static final org.bukkit.potion.PotionEffectType JUMP`
- `public static final org.bukkit.potion.PotionEffectType CONFUSION`
- `public static final org.bukkit.potion.PotionEffectType REGENERATION`
- `public static final org.bukkit.potion.PotionEffectType DAMAGE_RESISTANCE`
- `public static final org.bukkit.potion.PotionEffectType FIRE_RESISTANCE`
- `public static final org.bukkit.potion.PotionEffectType WATER_BREATHING`
- `public static final org.bukkit.potion.PotionEffectType INVISIBILITY`
- `public static final org.bukkit.potion.PotionEffectType BLINDNESS`
- `public static final org.bukkit.potion.PotionEffectType NIGHT_VISION`
- `public static final org.bukkit.potion.PotionEffectType HUNGER`
- `public static final org.bukkit.potion.PotionEffectType WEAKNESS`
- `public static final org.bukkit.potion.PotionEffectType POISON`
- `public static final org.bukkit.potion.PotionEffectType WITHER`
- `public static final org.bukkit.potion.PotionEffectType HEALTH_BOOST`
- `public static final org.bukkit.potion.PotionEffectType ABSORPTION`
- `public static final org.bukkit.potion.PotionEffectType SATURATION`
- `public static final org.bukkit.potion.PotionEffectType GLOWING`
- `public static final org.bukkit.potion.PotionEffectType LEVITATION`
- `public static final org.bukkit.potion.PotionEffectType LUCK`
- `public static final org.bukkit.potion.PotionEffectType UNLUCK`
- `public static final org.bukkit.potion.PotionEffectType SLOW_FALLING`
- `public static final org.bukkit.potion.PotionEffectType CONDUIT_POWER`
- `public static final org.bukkit.potion.PotionEffectType DOLPHINS_GRACE`
- `public static final org.bukkit.potion.PotionEffectType BAD_OMEN`
- `public static final org.bukkit.potion.PotionEffectType HERO_OF_THE_VILLAGE`
- `public static final org.bukkit.potion.PotionEffectType DARKNESS`
- `protected org.bukkit.potion.PotionEffectType(int, org.bukkit.NamespacedKey)`
- `public org.bukkit.potion.PotionEffect createEffect(int, int)`
- `public abstract double getDurationModifier()`
- `public int getId()`
- `public org.bukkit.NamespacedKey getKey()`
- `public abstract java.lang.String getName()`
- `public abstract boolean isInstant()`
- `public abstract org.bukkit.Color getColor()`
- `public boolean equals(java.lang.Object)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public static org.bukkit.potion.PotionEffectType getByKey(org.bukkit.NamespacedKey)`
- `public static org.bukkit.potion.PotionEffectType getById(int)`
- `public static org.bukkit.potion.PotionEffectType getByName(java.lang.String)`
- `public static void registerPotionEffectType(org.bukkit.potion.PotionEffectType)`
- `public static void stopAcceptingRegistrations()`
- `public static org.bukkit.potion.PotionEffectType[] values()`
