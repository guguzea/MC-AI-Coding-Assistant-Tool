---
title: "org.bukkit.plugin.messaging.StandardMessenger"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/messaging/StandardMessenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `void dispatchIncomingMessage(Player source, String channel, byte[] message)`
- `Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(String channel)`
- `Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(Plugin plugin)`
- `Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(Plugin plugin, String channel)`
- `Set<String> getIncomingChannels()`
- `Set<String> getIncomingChannels(Plugin plugin)`
- `Set<String> getOutgoingChannels()`
- `Set<String> getOutgoingChannels(Plugin plugin)`
- `boolean isIncomingChannelRegistered(Plugin plugin, String channel)`
- `boolean isOutgoingChannelRegistered(Plugin plugin, String channel)`
- `boolean isRegistrationValid(PluginMessageListenerRegistration registration)`
- `boolean isReservedChannel(String channel)`
- `PluginMessageListenerRegistration registerIncomingPluginChannel(Plugin plugin, String channel, PluginMessageListener listener)`
- `void registerOutgoingPluginChannel(Plugin plugin, String channel)`
- `void unregisterIncomingPluginChannel(Plugin plugin)`
- `void unregisterIncomingPluginChannel(Plugin plugin, String channel)`
- `void unregisterIncomingPluginChannel(Plugin plugin, String channel, PluginMessageListener listener)`
- `void unregisterOutgoingPluginChannel(Plugin plugin)`
- `void unregisterOutgoingPluginChannel(Plugin plugin, String channel)`
- `static void validateChannel(String channel)`
- `static void validatePluginMessage(Messenger messenger, Plugin source, String channel, byte[] message)`
