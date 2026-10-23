---
title: "org.bukkit.command.Command"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public abstract class org.bukkit.command.Command`
- `protected java.lang.String description`
- `protected java.lang.String usageMessage`
- `public org.spigotmc.CustomTimingsHandler timings`
- `protected org.bukkit.command.Command(java.lang.String)`
- `protected org.bukkit.command.Command(java.lang.String, java.lang.String, java.lang.String, java.util.List<java.lang.String>)`
- `public abstract boolean execute(org.bukkit.command.CommandSender, java.lang.String, java.lang.String[])`
- `public java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String, java.lang.String[]) throws java.lang.IllegalArgumentException`
- `public java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String, java.lang.String[], org.bukkit.Location) throws java.lang.IllegalArgumentException`
- `public java.lang.String getName()`
- `public boolean setName(java.lang.String)`
- `public java.lang.String getPermission()`
- `public void setPermission(java.lang.String)`
- `public boolean testPermission(org.bukkit.command.CommandSender)`
- `public boolean testPermissionSilent(org.bukkit.command.CommandSender)`
- `public java.lang.String getLabel()`
- `public boolean setLabel(java.lang.String)`
- `public boolean register(org.bukkit.command.CommandMap)`
- `public boolean unregister(org.bukkit.command.CommandMap)`
- `public boolean isRegistered()`
- `public java.util.List<java.lang.String> getAliases()`
- `public java.lang.String getPermissionMessage()`
- `public java.lang.String getDescription()`
- `public java.lang.String getUsage()`
- `public org.bukkit.command.Command setAliases(java.util.List<java.lang.String>)`
- `public org.bukkit.command.Command setDescription(java.lang.String)`
- `public org.bukkit.command.Command setPermissionMessage(java.lang.String)`
- `public org.bukkit.command.Command setUsage(java.lang.String)`
- `public static void broadcastCommandMessage(org.bukkit.command.CommandSender, java.lang.String)`
- `public static void broadcastCommandMessage(org.bukkit.command.CommandSender, java.lang.String, boolean)`
- `public java.lang.String toString()`
