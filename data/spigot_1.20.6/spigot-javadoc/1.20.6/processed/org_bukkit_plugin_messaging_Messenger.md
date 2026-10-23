---
title: "org.bukkit.plugin.messaging.Messenger"
package: "org.bukkit.plugin.messaging"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
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
