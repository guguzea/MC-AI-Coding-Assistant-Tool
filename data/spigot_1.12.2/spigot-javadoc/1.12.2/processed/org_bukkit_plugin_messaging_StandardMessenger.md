---
title: "org.bukkit.plugin.messaging.StandardMessenger"
package: "org.bukkit.plugin.messaging"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.plugin.messaging.StandardMessenger implements org.bukkit.plugin.messaging.Messenger`
- `public org.bukkit.plugin.messaging.StandardMessenger()`
- `public boolean isReservedChannel(java.lang.String)`
- `public void registerOutgoingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String)`
- `public void unregisterOutgoingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String)`
- `public void unregisterOutgoingPluginChannel(org.bukkit.plugin.Plugin)`
- `public org.bukkit.plugin.messaging.PluginMessageListenerRegistration registerIncomingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String, org.bukkit.plugin.messaging.PluginMessageListener)`
- `public void unregisterIncomingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String, org.bukkit.plugin.messaging.PluginMessageListener)`
- `public void unregisterIncomingPluginChannel(org.bukkit.plugin.Plugin, java.lang.String)`
- `public void unregisterIncomingPluginChannel(org.bukkit.plugin.Plugin)`
- `public java.util.Set<java.lang.String> getOutgoingChannels()`
- `public java.util.Set<java.lang.String> getOutgoingChannels(org.bukkit.plugin.Plugin)`
- `public java.util.Set<java.lang.String> getIncomingChannels()`
- `public java.util.Set<java.lang.String> getIncomingChannels(org.bukkit.plugin.Plugin)`
- `public java.util.Set<org.bukkit.plugin.messaging.PluginMessageListenerRegistration> getIncomingChannelRegistrations(org.bukkit.plugin.Plugin)`
- `public java.util.Set<org.bukkit.plugin.messaging.PluginMessageListenerRegistration> getIncomingChannelRegistrations(java.lang.String)`
- `public java.util.Set<org.bukkit.plugin.messaging.PluginMessageListenerRegistration> getIncomingChannelRegistrations(org.bukkit.plugin.Plugin, java.lang.String)`
- `public boolean isRegistrationValid(org.bukkit.plugin.messaging.PluginMessageListenerRegistration)`
- `public boolean isIncomingChannelRegistered(org.bukkit.plugin.Plugin, java.lang.String)`
- `public boolean isOutgoingChannelRegistered(org.bukkit.plugin.Plugin, java.lang.String)`
- `public void dispatchIncomingMessage(org.bukkit.entity.Player, java.lang.String, byte[])`
- `public static void validateChannel(java.lang.String)`
- `public static void validatePluginMessage(org.bukkit.plugin.messaging.Messenger, org.bukkit.plugin.Plugin, java.lang.String, byte[])`
