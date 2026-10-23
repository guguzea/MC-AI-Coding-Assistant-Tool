---
title: "org.bukkit.command.PluginCommand"
package: "org.bukkit.command"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
