---
title: "org.bukkit.inventory.meta.FireworkMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.inventory.meta.FireworkMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract void addEffect(org.bukkit.FireworkEffect) throws java.lang.IllegalArgumentException`
- `public abstract void addEffects(org.bukkit.FireworkEffect...) throws java.lang.IllegalArgumentException`
- `public abstract void addEffects(java.lang.Iterable<org.bukkit.FireworkEffect>) throws java.lang.IllegalArgumentException`
- `public abstract java.util.List<org.bukkit.FireworkEffect> getEffects()`
- `public abstract int getEffectsSize()`
- `public abstract void removeEffect(int) throws java.lang.IndexOutOfBoundsException`
- `public abstract void clearEffects()`
- `public abstract boolean hasEffects()`
- `public abstract int getPower()`
- `public abstract void setPower(int) throws java.lang.IllegalArgumentException`
- `public abstract org.bukkit.inventory.meta.FireworkMeta clone()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
