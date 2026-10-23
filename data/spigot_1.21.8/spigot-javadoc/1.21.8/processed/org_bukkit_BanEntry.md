---
title: "org.bukkit.BanEntry"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.BanEntry<T>`
- `public abstract java.lang.String getTarget()`
- `public abstract T getBanTarget()`
- `public abstract java.util.Date getCreated()`
- `public abstract void setCreated(java.util.Date)`
- `public abstract java.lang.String getSource()`
- `public abstract void setSource(java.lang.String)`
- `public abstract java.util.Date getExpiration()`
- `public abstract void setExpiration(java.util.Date)`
- `public abstract java.lang.String getReason()`
- `public abstract void setReason(java.lang.String)`
- `public abstract void save()`
- `public abstract void remove()`
