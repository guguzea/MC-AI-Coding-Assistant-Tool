---
title: "org.bukkit.plugin.RegisteredServiceProvider"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/RegisteredServiceProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class RegisteredServiceProvider<T>**
`public class RegisteredServiceProvider<T> extends Object implements Comparable<RegisteredServiceProvider<?>>`
- `public RegisteredServiceProvider(@NotNull @NotNull Class<T> service, @NotNull T provider, @NotNull @NotNull ServicePriority priority, @NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Class<T> getService()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public T getProvider()`
- `@NotNull public @NotNull ServicePriority getPriority()`
- `public int compareTo(@NotNull @NotNull RegisteredServiceProvider<?> other)`
