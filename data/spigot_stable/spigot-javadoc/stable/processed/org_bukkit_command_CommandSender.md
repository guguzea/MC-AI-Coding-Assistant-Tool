---
title: "org.bukkit.command.CommandSender"
package: "org.bukkit.command"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/command/CommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface CommandSender**
`public interface CommandSender extends Permissible`
- `void sendMessage(@NotNull String message)`
- `void sendMessage(@NotNull String... messages)`
- `void sendMessage(@Nullable UUID sender, @NotNull String message)`
- `void sendMessage(@Nullable UUID sender, @NotNull String... messages)`
- `@NotNull Server getServer()`
- `@NotNull String getName()`
- `@NotNull CommandSender.Spigot spigot()`
