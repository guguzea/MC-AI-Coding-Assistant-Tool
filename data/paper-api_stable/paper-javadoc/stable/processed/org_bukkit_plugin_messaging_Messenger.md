---
title: "org.bukkit.plugin.messaging.Messenger"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/messaging/Messenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Messenger**
`public interface Messenger`
- `static final int MAX_MESSAGE_SIZE`
- `static final int MAX_CHANNEL_SIZE`
- `boolean isReservedChannel(@NotNull @NotNull String channel)`
- `void registerOutgoingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void unregisterOutgoingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void unregisterOutgoingPluginChannel(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull PluginMessageListenerRegistration registerIncomingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `void unregisterIncomingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `void unregisterIncomingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void unregisterIncomingPluginChannel(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<String> getOutgoingChannels()`
- `@NotNull @NotNull Set<String> getOutgoingChannels(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<String> getIncomingChannels()`
- `@NotNull @NotNull Set<String> getIncomingChannels(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull @NotNull String channel)`
- `@NotNull @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `boolean isRegistrationValid(@NotNull @NotNull PluginMessageListenerRegistration registration)`
- `boolean isIncomingChannelRegistered(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `boolean isOutgoingChannelRegistered(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `@Deprecated void dispatchIncomingMessage(@NotNull @NotNull Player source, @NotNull @NotNull String channel, byte @NotNull [] message)`
- `void dispatchIncomingMessage(@NotNull @NotNull PlayerConnection source, @NotNull @NotNull String channel, byte @NotNull [] message)`
