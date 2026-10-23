---
title: "org.bukkit.packs.DataPack"
package: "org.bukkit.packs"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.packs.DataPack extends org.bukkit.Keyed`
- `public abstract java.lang.String getTitle()`
- `public abstract java.lang.String getDescription()`
- `public abstract int getPackFormat()`
- `public abstract int getMinSupportedPackFormat()`
- `public abstract int getMaxSupportedPackFormat()`
- `public abstract boolean isEnabled()`
- `public abstract boolean isRequired()`
- `public abstract org.bukkit.packs.DataPack$Compatibility getCompatibility()`
- `public abstract java.util.Set<org.bukkit.FeatureFlag> getRequestedFeatures()`
- `public abstract org.bukkit.packs.DataPack$Source getSource()`
