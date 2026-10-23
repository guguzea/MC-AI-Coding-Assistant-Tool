---
title: "org.bukkit.inventory.meta.BannerMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.inventory.meta.BannerMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract org.bukkit.DyeColor getBaseColor()`
- `public abstract void setBaseColor(org.bukkit.DyeColor)`
- `public abstract java.util.List<org.bukkit.block.banner.Pattern> getPatterns()`
- `public abstract void setPatterns(java.util.List<org.bukkit.block.banner.Pattern>)`
- `public abstract void addPattern(org.bukkit.block.banner.Pattern)`
- `public abstract org.bukkit.block.banner.Pattern getPattern(int)`
- `public abstract org.bukkit.block.banner.Pattern removePattern(int)`
- `public abstract void setPattern(int, org.bukkit.block.banner.Pattern)`
- `public abstract int numberOfPatterns()`
