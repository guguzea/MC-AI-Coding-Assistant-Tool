---
title: "org.bukkit.plugin.RegisteredServiceProvider"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/RegisteredServiceProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class RegisteredServiceProvider<T>**
`public class RegisteredServiceProvider<T> extends Object implements Comparable<RegisteredServiceProvider<?>>`
- `public RegisteredServiceProvider(@NotNull Class<T> service, @NotNull T provider, @NotNull ServicePriority priority, @NotNull Plugin plugin)`
- `@NotNull public Class<T> getService()`
- `@NotNull public Plugin getPlugin()`
- `@NotNull public T getProvider()`
- `@NotNull public ServicePriority getPriority()`
- `public int compareTo(@NotNull RegisteredServiceProvider<?> other)`
