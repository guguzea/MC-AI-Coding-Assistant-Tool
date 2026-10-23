---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
