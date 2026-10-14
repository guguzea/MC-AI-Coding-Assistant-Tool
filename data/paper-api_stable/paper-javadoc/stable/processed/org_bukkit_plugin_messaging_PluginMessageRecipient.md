---
title: "org.bukkit.plugin.messaging.PluginMessageRecipient"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/messaging/PluginMessageRecipient.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PluginMessageRecipient**
`public interface PluginMessageRecipient`
- `void sendPluginMessage(@NotNull @NotNull Plugin source, @NotNull @NotNull String channel, byte @NotNull [] message)`
- `@NotNull @NotNull Set<String> getListeningPluginChannels()`
