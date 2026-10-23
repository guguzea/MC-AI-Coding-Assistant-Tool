---
title: "org.bukkit.plugin.messaging.Messenger"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/messaging/Messenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `static final int MAX_MESSAGE_SIZE`
- `static final int MAX_CHANNEL_SIZE`
- `boolean isReservedChannel&#8203;(@NotNull @NotNull String channel)`
- `void registerOutgoingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void unregisterOutgoingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void unregisterOutgoingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull PluginMessageListenerRegistration registerIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `void unregisterIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `void unregisterIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void unregisterIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<String> getOutgoingChannels()`
- `@NotNull @NotNull Set<String> getOutgoingChannels&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<String> getIncomingChannels()`
- `@NotNull @NotNull Set<String> getIncomingChannels&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations&#8203;(@NotNull @NotNull String channel)`
- `@NotNull @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `boolean isRegistrationValid&#8203;(@NotNull @NotNull PluginMessageListenerRegistration registration)`
- `boolean isIncomingChannelRegistered&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `boolean isOutgoingChannelRegistered&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `void dispatchIncomingMessage&#8203;(@NotNull @NotNull Player source, @NotNull @NotNull String channel, @NotNull @org.jetbrains.annotations.NotNull byte[] message)`
