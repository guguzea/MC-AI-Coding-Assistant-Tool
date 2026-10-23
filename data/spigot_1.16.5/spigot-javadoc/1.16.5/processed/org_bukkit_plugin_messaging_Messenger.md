---
title: "org.bukkit.plugin.messaging.Messenger"
package: "org.bukkit.plugin.messaging"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.plugin.messaging.Messenger`
- `public static final int MAX_MESSAGE_SIZE`
- `public static final int MAX_CHANNEL_SIZE`
- `public abstract boolean isReservedChannel(java.lang.String)`
- `public abstract void registerOutgoingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String)`
- `public abstract void unregisterOutgoingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String)`
- `public abstract void unregisterOutgoingPluginChannel(org.bukkit.plugin.Plugin)`
- `public abstract org.bukkit.plugin.messaging.PluginMessageListenerRegistration registerIncomingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String, org.bukkit.plugin.messaging.PluginMessageListener)`
- `public abstract void unregisterIncomingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String, org.bukkit.plugin.messaging.PluginMessageListener)`
- `public abstract void unregisterIncomingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String)`
- `public abstract void unregisterIncomingPluginChannel(org.bukkit.plugin.Plugin)`
- `public abstract java.util.Set<java.lang.String> getOutgoingChannels()`
- `public abstract java.util.Set<java.lang.String> getOutgoingChannels(org.bukkit.plugin.Plugin)`
- `public abstract java.util.Set<java.lang.String> getIncomingChannels()`
- `public abstract java.util.Set<java.lang.String> getIncomingChannels(org.bukkit.plugin.Plugin)`
- `public abstract java.util.Set<org.bukkit.plugin.messaging.PluginMessageListenerRegistration> getIncomingChannelRegistrations(org.bukkit.plugin.Plugin)`
- `public abstract java.util.Set<org.bukkit.plugin.messaging.PluginMessageListenerRegistration> getIncomingChannelRegistrations(java.lang.String)`
- `public abstract java.util.Set<org.bukkit.plugin.messaging.PluginMessageListenerRegistration> getIncomingChannelRegistrations(org.bukkit.plugin.Plugin, java.lang.String)`
- `public abstract boolean isRegistrationValid(org.bukkit.plugin.messaging.PluginMessageListenerRegistration)`
- `public abstract boolean isIncomingChannelRegistered(org.bukkit.plugin.Plugin, java.lang.String)`
- `public abstract boolean isOutgoingChannelRegistered(org.bukkit.plugin.Plugin, java.lang.String)`
- `public abstract void dispatchIncomingMessage(org.bukkit.entity.Player, java.lang.String, byte[])`
