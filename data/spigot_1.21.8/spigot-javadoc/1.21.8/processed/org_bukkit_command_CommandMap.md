---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
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
