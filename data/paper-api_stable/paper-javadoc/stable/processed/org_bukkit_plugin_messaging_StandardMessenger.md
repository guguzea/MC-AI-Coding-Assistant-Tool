---
title: "org.bukkit.plugin.messaging.StandardMessenger"
package: "org.bukkit.plugin.messaging"
source: https://jd.papermc.io/paper/26.3/org/bukkit/plugin/messaging/StandardMessenger.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class StandardMessenger**
`public class StandardMessenger extends Object implements Messenger`
- `public StandardMessenger()`
- `public boolean isReservedChannel(@NotNull @NotNull String channel)`
- `public void registerOutgoingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void unregisterOutgoingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void unregisterOutgoingPluginChannel(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull PluginMessageListenerRegistration registerIncomingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `public void unregisterIncomingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel, @NotNull @NotNull PluginMessageListener listener)`
- `public void unregisterIncomingPluginChannel(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public void unregisterIncomingPluginChannel(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<String> getOutgoingChannels()`
- `@NotNull public @NotNull Set<String> getOutgoingChannels(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<String> getIncomingChannels()`
- `@NotNull public @NotNull Set<String> getIncomingChannels(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull @NotNull Plugin plugin)`
- `@NotNull public @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull @NotNull String channel)`
- `@NotNull public @NotNull Set<PluginMessageListenerRegistration> getIncomingChannelRegistrations(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public boolean isRegistrationValid(@NotNull @NotNull PluginMessageListenerRegistration registration)`
- `public boolean isIncomingChannelRegistered(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `public boolean isOutgoingChannelRegistered(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String channel)`
- `@Deprecated public void dispatchIncomingMessage(@NotNull @NotNull Player source, @NotNull @NotNull String channel, byte @NotNull [] message)`
- `public void dispatchIncomingMessage(@NotNull @NotNull PlayerConnection source, @NotNull @NotNull String channel, byte @NotNull [] message)`
- `@Deprecated(since="1.13") public static void validateChannel(@NotNull @NotNull String channel)`
- `@Deprecated(since="1.13") @NotNull public static @NotNull String validateAndCorrectChannel(@NotNull @NotNull String channel)`
- `public static void validatePluginMessage(@NotNull @NotNull Messenger messenger, @NotNull @NotNull Plugin source, @NotNull @NotNull String channel, byte @NotNull [] message)`
