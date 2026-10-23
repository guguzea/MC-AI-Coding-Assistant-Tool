---
title: "org.bukkit.damage.DamageSource"
package: "org.bukkit.damage"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.damage.DamageSource`
- `public abstract org.bukkit.damage.DamageType getDamageType()`
- `public abstract org.bukkit.entity.Entity getCausingEntity()`
- `public abstract org.bukkit.entity.Entity getDirectEntity()`
- `public abstract org.bukkit.Location getDamageLocation()`
- `public abstract org.bukkit.Location getSourceLocation()`
- `public abstract boolean isIndirect()`
- `public abstract float getFoodExhaustion()`
- `public abstract boolean scalesWithDifficulty()`
- `public static org.bukkit.damage.DamageSource$Builder builder(org.bukkit.damage.DamageType)`
