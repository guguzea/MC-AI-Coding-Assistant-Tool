---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.BanList`
- `public abstract org.bukkit.BanEntry getBanEntry(java.lang.String)`
- `public abstract org.bukkit.BanEntry addBan(java.lang.String, java.lang.String, java.util.Date, java.lang.String)`
- `public abstract java.util.Set<org.bukkit.BanEntry> getBanEntries()`
- `public abstract boolean isBanned(java.lang.String)`
- `public abstract void pardon(java.lang.String)`
