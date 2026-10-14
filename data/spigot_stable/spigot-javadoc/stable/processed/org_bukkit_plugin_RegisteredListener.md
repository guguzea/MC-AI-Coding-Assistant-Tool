---
title: "org.bukkit.plugin.RegisteredListener"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/RegisteredListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class RegisteredListener**
`public class RegisteredListener extends Object`
- `public RegisteredListener(@NotNull Listener listener, @NotNull EventExecutor executor, @NotNull EventPriority priority, @NotNull Plugin plugin, boolean ignoreCancelled)`
- `@NotNull public Listener getListener()`
- `@NotNull public Plugin getPlugin()`
- `@NotNull public EventPriority getPriority()`
- `public void callEvent(@NotNull Event event) throws EventException`
- `public boolean isIgnoringCancelled()`
