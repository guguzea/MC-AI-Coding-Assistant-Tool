---
title: "org.bukkit.plugin.RegisteredServiceProvider"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/plugin/RegisteredServiceProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public RegisteredServiceProvider(@NotNull @NotNull Class<T> service, @NotNull T provider, @NotNull @NotNull ServicePriority priority, @NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Class<T> getService()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public T getProvider()`
- `@NotNull public @NotNull ServicePriority getPriority()`
- `public int compareTo(@NotNull @NotNull RegisteredServiceProvider<?> other)`
