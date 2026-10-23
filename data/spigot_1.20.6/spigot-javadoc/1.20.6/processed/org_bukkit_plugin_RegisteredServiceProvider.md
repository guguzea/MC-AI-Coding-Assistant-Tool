---
title: "org.bukkit.plugin.RegisteredServiceProvider"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.plugin.RegisteredServiceProvider<T> implements java.lang.Comparable<org.bukkit.plugin.RegisteredServiceProvider<?>>`
- `public org.bukkit.plugin.RegisteredServiceProvider(java.lang.Class<T>, T, org.bukkit.plugin.ServicePriority, org.bukkit.plugin.Plugin)`
- `public java.lang.Class<T> getService()`
- `public org.bukkit.plugin.Plugin getPlugin()`
- `public T getProvider()`
- `public org.bukkit.plugin.ServicePriority getPriority()`
- `public int compareTo(org.bukkit.plugin.RegisteredServiceProvider<?>)`
- `public int compareTo(java.lang.Object)`
