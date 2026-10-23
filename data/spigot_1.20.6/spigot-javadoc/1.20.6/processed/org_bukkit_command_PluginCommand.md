---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public final class org.bukkit.command.PluginCommand extends org.bukkit.command.Command implements org.bukkit.command.PluginIdentifiableCommand`
- `protected org.bukkit.command.PluginCommand(java.lang.String, org.bukkit.plugin.Plugin)`
- `public boolean execute(org.bukkit.command.CommandSender, java.lang.String, java.lang.String[])`
- `public void setExecutor(org.bukkit.command.CommandExecutor)`
- `public org.bukkit.command.CommandExecutor getExecutor()`
- `public void setTabCompleter(org.bukkit.command.TabCompleter)`
- `public org.bukkit.command.TabCompleter getTabCompleter()`
- `public org.bukkit.plugin.Plugin getPlugin()`
- `public java.util.List<java.lang.String> tabComplete(org.bukkit.command.CommandSender, java.lang.String, java.lang.String[]) throws org.bukkit.command.CommandException, java.lang.IllegalArgumentException`
- `public java.lang.String toString()`
