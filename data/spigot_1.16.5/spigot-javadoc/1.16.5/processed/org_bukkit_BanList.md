---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.BanList`
- `public abstract org.bukkit.BanEntry getBanEntry(java.lang.String)`
- `public abstract org.bukkit.BanEntry addBan(java.lang.String, java.lang.String, java.util.Date, java.lang.String)`
- `public abstract java.util.Set<org.bukkit.BanEntry> getBanEntries()`
- `public abstract boolean isBanned(java.lang.String)`
- `public abstract void pardon(java.lang.String)`
