---
title: "org.bukkit.plugin.RegisteredListener"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/RegisteredListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public RegisteredListener&#8203;(@NotNull @NotNull Listener listener, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull EventPriority priority, @NotNull @NotNull Plugin plugin, boolean ignoreCancelled)`
- `@NotNull public @NotNull Listener getListener()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public @NotNull EventPriority getPriority()`
- `public void callEvent&#8203;(@NotNull @NotNull Event event) throws EventException`
- `public boolean isIgnoringCancelled()`
