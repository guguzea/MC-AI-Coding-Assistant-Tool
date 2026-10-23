---
title: "org.bukkit.command.CommandMap"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
