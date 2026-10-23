---
title: "org.bukkit.command.SimpleCommandMap"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
