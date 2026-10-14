---
title: "org.bukkit.plugin.RegisteredListener"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/RegisteredListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class RegisteredListener**
`public class RegisteredListener extends Object`
- `public RegisteredListener(@NotNull @NotNull Listener listener, @NotNull @NotNull EventExecutor executor, @NotNull @NotNull EventPriority priority, @NotNull @NotNull Plugin plugin, boolean ignoreCancelled)`
- `@NotNull public @NotNull Listener getListener()`
- `@NotNull public @NotNull Plugin getPlugin()`
- `@NotNull public @NotNull EventPriority getPriority()`
- `public void callEvent(@NotNull @NotNull Event event) throws EventException`
- `public boolean isIgnoringCancelled()`
- `@NotNull public @NotNull EventExecutor getExecutor()`
- `public String toString()`
