---
title: "org.bukkit.plugin.messaging.StandardMessenger"
package: "org.bukkit.plugin.messaging"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/messaging/StandardMessenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class StandardMessenger**
`public class StandardMessenger extends Object implements Messenger`
- `public StandardMessenger()`
- `public boolean isReservedChannel(@NotNull String channel)`
- `public void registerOutgoingPluginChannel(@NotNull Plugin plugin, @NotNull String channel)`
- `public void unregisterOutgoingPluginChannel(@NotNull Plugin plugin, @NotNull String channel)`
- `public void unregisterOutgoingPluginChannel(@NotNull Plugin plugin)`
- `@NotNull public PluginMessageListenerRegistration registerIncomingPluginChannel(@NotNull Plugin plugin, @NotNull String channel, @NotNull PluginMessageListener listener)`
- `public void unregisterIncomingPluginChannel(@NotNull Plugin plugin, @NotNull String channel, @NotNull PluginMessageListener listener)`
- `public void unregisterIncomingPluginChannel(@NotNull Plugin plugin, @NotNull String channel)`
- `public void unregisterIncomingPluginChannel(@NotNull Plugin plugin)`
- `@NotNull public Set<String> getOutgoingChannels()`
- `@NotNull public Set<String> getOutgoingChannels(@NotNull Plugin plugin)`
- `@NotNull public Set<String> getIncomingChannels()`
- `@NotNull public Set<String> getIncomingChannels(@NotNull Plugin plugin)`
- `@NotNull public Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull Plugin plugin)`
- `@NotNull public Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull String channel)`
- `@NotNull public Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull Plugin plugin, @NotNull String channel)`
- `public boolean isRegistrationValid(@NotNull PluginMessageListenerRegistration registration)`
- `public boolean isIncomingChannelRegistered(@NotNull Plugin plugin, @NotNull String channel)`
- `public boolean isOutgoingChannelRegistered(@NotNull Plugin plugin, @NotNull String channel)`
- `public void dispatchIncomingMessage(@NotNull Player source, @NotNull String channel, @NotNull byte[] message)`
- `@Deprecated(since="1.13") public static void validateChannel(@NotNull String channel)`
- `@Deprecated(since="1.13") @NotNull public static String validateAndCorrectChannel(@NotNull String channel)`
- `public static void validatePluginMessage(@NotNull Messenger messenger, @NotNull Plugin source, @NotNull String channel, @NotNull byte[] message)`
