---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.command.CommandMap`
- `public abstract void registerAll(java.lang.String, java.util.List<org.bukkit.command.Command>)`
- `public abstract boolean register(java.lang.String, java.lang.String, org.bukkit.command.Command)`
- `public abstract boolean register(java.lang.String, org.bukkit.command.Command)`
- `public abstract boolean dispatch(org.bukkit.command.CommandSender, java.lang.String) throws org.bukkit.command.CommandException`
- `public abstract void clearCommands()`
- `public abstract org.bukkit.command.Command getCommand(java.lang.String)`
- `public abstract java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String) throws java.lang.IllegalArgumentException`
- `public abstract java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String, org.bukkit.Location) throws java.lang.IllegalArgumentException`
