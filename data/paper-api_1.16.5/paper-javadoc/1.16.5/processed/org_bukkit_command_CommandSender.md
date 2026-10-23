---
title: "org.bukkit.command.CommandSender"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/command/CommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `void sendMessage&#8203;(@NotNull @NotNull String message)`
- `void sendMessage&#8203;(@NotNull @NotNull String[] messages)`
- `void sendMessage&#8203;(@Nullable @Nullable UUID sender, @NotNull @NotNull String message)`
- `void sendMessage&#8203;(@Nullable @Nullable UUID sender, @NotNull @NotNull String[] messages)`
- `@NotNull @NotNull Server getServer()`
- `@NotNull @NotNull String getName()`
- `@NotNull @NotNull CommandSender.Spigot spigot()`
- `default void sendMessage&#8203;(@NotNull Identity identity, @NotNull Component message, @NotNull MessageType type)`
- `@Deprecated default void sendMessage&#8203;(@NotNull BaseComponent component)`
- `@Deprecated default void sendMessage&#8203;(@NotNull @NotNull BaseComponent... components)`
