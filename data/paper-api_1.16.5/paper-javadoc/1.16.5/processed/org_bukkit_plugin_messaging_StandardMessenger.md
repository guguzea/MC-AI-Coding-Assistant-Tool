---
title: "org.bukkit.plugin.messaging.StandardMessenger"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/plugin/messaging/StandardMessenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public StandardMessenger()`
- `public boolean isReservedChannel&#8203;(@NotNull @NotNull String channel)`
- `public void registerOutgoingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void unregisterOutgoingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void unregisterOutgoingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull PluginMessageListenerRegistration registerIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `public void unregisterIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `public void unregisterIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void unregisterIncomingPluginChannel&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<String> getOutgoingChannels()`
- `@NotNull public @NotNull Set<String> getOutgoingChannels&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<String> getIncomingChannels()`
- `@NotNull public @NotNull Set<String> getIncomingChannels&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations&#8203;(@NotNull @NotNull String channel)`
- `@NotNull public @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public boolean isRegistrationValid&#8203;(@NotNull @NotNull PluginMessageListenerRegistration registration)`
- `public boolean isIncomingChannelRegistered&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public boolean isOutgoingChannelRegistered&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void dispatchIncomingMessage&#8203;(@NotNull @NotNull Player source, @NotNull @NotNull String channel, @NotNull @org.jetbrains.annotations.NotNull byte[] message)`
- `@Deprecated public static void validateChannel&#8203;(@NotNull @NotNull String channel)`
- `@Deprecated @NotNull public static @NotNull String validateAndCorrectChannel&#8203;(@NotNull @NotNull String channel)`
- `public static void validatePluginMessage&#8203;(@NotNull @NotNull Messenger messenger, @NotNull @NotNull Plugin source, @NotNull @NotNull String channel, @NotNull @org.jetbrains.annotations.NotNull byte[] message)`
