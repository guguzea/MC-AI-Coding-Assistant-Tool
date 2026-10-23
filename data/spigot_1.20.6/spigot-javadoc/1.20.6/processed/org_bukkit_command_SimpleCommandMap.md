---
title: "org.bukkit.command.SimpleCommandMap"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.command.SimpleCommandMap implements org.bukkit.command.CommandMap`
- `protected final java.util.Map<java.lang.String, org.bukkit.command.Command> knownCommands`
- `public org.bukkit.command.SimpleCommandMap(org.bukkit.Server)`
- `public void setFallbackCommands()`
- `public void registerAll(java.lang.String, java.util.List<org.bukkit.command.Command>)`
- `public boolean register(java.lang.String, org.bukkit.command.Command)`
- `public boolean register(java.lang.String, java.lang.String, org.bukkit.command.Command)`
- `public boolean dispatch(org.bukkit.command.CommandSender, java.lang.String) throws org.bukkit.command.CommandException`
- `public synchronized void clearCommands()`
- `public org.bukkit.command.Command getCommand(java.lang.String)`
- `public java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String)`
- `public java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String, org.bukkit.Location)`
- `public java.util.Collection<org.bukkit.command.Command> getCommands()`
- `public void registerServerAliases()`
