---
title: "org.bukkit.plugin.messaging.Messenger"
package: "org.bukkit.plugin.messaging"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/messaging/Messenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Messenger**
`public interface Messenger`
- `static final int MAX_MESSAGE_SIZE`
- `static final int MAX_CHANNEL_SIZE`
- `boolean isReservedChannel(@NotNull String channel)`
- `void registerOutgoingPluginChannel(@NotNull Plugin plugin, @NotNull String channel)`
- `void unregisterOutgoingPluginChannel(@NotNull Plugin plugin, @NotNull String channel)`
- `void unregisterOutgoingPluginChannel(@NotNull Plugin plugin)`
- `@NotNull PluginMessageListenerRegistration registerIncomingPluginChannel(@NotNull Plugin plugin, @NotNull String channel, @NotNull PluginMessageListener listener)`
- `void unregisterIncomingPluginChannel(@NotNull Plugin plugin, @NotNull String channel, @NotNull PluginMessageListener listener)`
- `void unregisterIncomingPluginChannel(@NotNull Plugin plugin, @NotNull String channel)`
- `void unregisterIncomingPluginChannel(@NotNull Plugin plugin)`
- `@NotNull Set<String> getOutgoingChannels()`
- `@NotNull Set<String> getOutgoingChannels(@NotNull Plugin plugin)`
- `@NotNull Set<String> getIncomingChannels()`
- `@NotNull Set<String> getIncomingChannels(@NotNull Plugin plugin)`
- `@NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull Plugin plugin)`
- `@NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull String channel)`
- `@NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull Plugin plugin, @NotNull String channel)`
- `boolean isRegistrationValid(@NotNull PluginMessageListenerRegistration registration)`
- `boolean isIncomingChannelRegistered(@NotNull Plugin plugin, @NotNull String channel)`
- `boolean isOutgoingChannelRegistered(@NotNull Plugin plugin, @NotNull String channel)`
- `void dispatchIncomingMessage(@NotNull Player source, @NotNull String channel, @NotNull byte[] message)`
