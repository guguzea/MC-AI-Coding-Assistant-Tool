---
title: "org.bukkit.plugin.SimpleServicesManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/SimpleServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public SimpleServicesManager()`
- `public <T> void register&#8203;(@NotNull @NotNull Class<T> service, @NotNull T provider, @NotNull @NotNull Plugin plugin, @NotNull @NotNull ServicePriority priority)`
- `public void unregisterAll&#8203;(@NotNull @NotNull Plugin plugin)`
- `public void unregister&#8203;(@NotNull @NotNull Class<?> service, @NotNull @NotNull Object provider)`
- `public void unregister&#8203;(@NotNull @NotNull Object provider)`
- `@Nullable public <T> T load&#8203;(@NotNull @NotNull Class<T> service)`
- `@Nullable public <T> @Nullable RegisteredServiceProvider<T> getRegistration&#8203;(@NotNull @NotNull Class<T> service)`
- `@NotNull public @NotNull List<RegisteredServiceProvider<?>> getRegistrations&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public <T> @NotNull List<RegisteredServiceProvider<T>> getRegistrations&#8203;(@NotNull @NotNull Class<T> service)`
- `@NotNull public @NotNull Set<Class<?>> getKnownServices()`
- `public <T> boolean isProvidedFor&#8203;(@NotNull @NotNull Class<T> service)`
