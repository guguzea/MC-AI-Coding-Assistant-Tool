---
title: "org.bukkit.damage.DamageSource"
package: "org.bukkit.damage"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
