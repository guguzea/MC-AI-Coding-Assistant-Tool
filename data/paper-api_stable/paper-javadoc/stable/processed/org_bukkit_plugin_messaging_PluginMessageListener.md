---
title: "org.bukkit.plugin.messaging.PluginMessageListener"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/messaging/PluginMessageListener.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PluginMessageListener**
`@FunctionalInterface public interface PluginMessageListener`
- `void onPluginMessageReceived(@NotNull @NotNull String channel, @NotNull @NotNull Player player, byte @NotNull [] message)`
- `default void onPluginMessageReceived(@NotNull @NotNull String channel, @NotNull @NotNull PlayerConnection connection, byte @NotNull [] message)`
