---
title: "org.bukkit.plugin.RegisteredServiceProvider"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public class org.bukkit.plugin.RegisteredServiceProvider<T> implements java.lang.Comparable<org.bukkit.plugin.RegisteredServiceProvider<?>>`
- `public org.bukkit.plugin.RegisteredServiceProvider(java.lang.Class<T>, T, org.bukkit.plugin.ServicePriority, org.bukkit.plugin.Plugin)`
- `public java.lang.Class<T> getService()`
- `public org.bukkit.plugin.Plugin getPlugin()`
- `public T getProvider()`
- `public org.bukkit.plugin.ServicePriority getPriority()`
- `public int compareTo(org.bukkit.plugin.RegisteredServiceProvider<?>)`
- `public int compareTo(java.lang.Object)`
