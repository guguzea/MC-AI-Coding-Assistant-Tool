---
title: "org.bukkit.plugin.ServicesManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/ServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `<T> void register&#8203;(@NotNull @NotNull Class<T> service, @NotNull T provider, @NotNull @NotNull Plugin plugin, @NotNull @NotNull ServicePriority priority)`
- `void unregisterAll&#8203;(@NotNull @NotNull Plugin plugin)`
- `void unregister&#8203;(@NotNull @NotNull Class<?> service, @NotNull @NotNull Object provider)`
- `void unregister&#8203;(@NotNull @NotNull Object provider)`
- `@Nullable <T> T load&#8203;(@NotNull @NotNull Class<T> service)`
- `@Nullable <T> @Nullable RegisteredServiceProvider<T> getRegistration&#8203;(@NotNull @NotNull Class<T> service)`
- `@NotNull @NotNull List<RegisteredServiceProvider<?>> getRegistrations&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull <T> @NotNull Collection<RegisteredServiceProvider<T>> getRegistrations&#8203;(@NotNull @NotNull Class<T> service)`
- `@NotNull @NotNull Collection<Class<?>> getKnownServices()`
- `<T> boolean isProvidedFor&#8203;(@NotNull @NotNull Class<T> service)`
