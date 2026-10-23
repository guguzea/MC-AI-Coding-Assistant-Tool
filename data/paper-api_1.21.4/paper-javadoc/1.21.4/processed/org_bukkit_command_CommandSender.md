---
title: "org.bukkit.command.CommandSender"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/command/CommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Obsolete void sendMessage(@NotNull @NotNull String message)`
- `@Obsolete void sendMessage(@NotNull @NotNull String... messages)`
- `@Deprecated void sendMessage(@Nullable @Nullable UUID sender, @NotNull @NotNull String message)`
- `@Deprecated void sendMessage(@Nullable @Nullable UUID sender, @NotNull @NotNull String... messages)`
- `@NotNull @NotNull Server getServer()`
- `@NotNull @NotNull String getName()`
- `@NotNull @NotNull CommandSender.Spigot spigot()`
- `@NotNull Component name()`
- `default void sendMessage(@NotNull Identity identity, @NotNull Component message, @NotNull MessageType type)`
- `default void sendRichMessage(@NotNull @NotNull String message)`
- `default void sendRichMessage(@NotNull @NotNull String message, @NotNull TagResolver... resolvers)`
- `default void sendPlainMessage(@NotNull @NotNull String message)`
- `@Deprecated default void sendMessage(@NotNull net.md_5.bungee.api.chat.BaseComponent component)`
- `@Deprecated default void sendMessage(@NotNull net.md_5.bungee.api.chat.BaseComponent... components)`
