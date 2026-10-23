---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.BanList<T>`
- `public abstract org.bukkit.BanEntry<T> getBanEntry(java.lang.String)`
- `public abstract org.bukkit.BanEntry<T> getBanEntry(T)`
- `public abstract org.bukkit.BanEntry<T> addBan(java.lang.String, java.lang.String, java.util.Date, java.lang.String)`
- `public abstract org.bukkit.BanEntry<T> addBan(T, java.lang.String, java.util.Date, java.lang.String)`
- `public abstract org.bukkit.BanEntry<T> addBan(T, java.lang.String, java.time.Instant, java.lang.String)`
- `public abstract org.bukkit.BanEntry<T> addBan(T, java.lang.String, java.time.Duration, java.lang.String)`
- `public abstract java.util.Set<org.bukkit.BanEntry> getBanEntries()`
- `public abstract java.util.Set<org.bukkit.BanEntry<T>> getEntries()`
- `public abstract boolean isBanned(T)`
- `public abstract boolean isBanned(java.lang.String)`
- `public abstract void pardon(T)`
- `public abstract void pardon(java.lang.String)`
