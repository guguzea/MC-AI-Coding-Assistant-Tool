---
title: "org.bukkit.command.ProxiedCommandSender"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/26.3/org/bukkit/command/ProxiedCommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ProxiedCommandSender**
`public interface ProxiedCommandSender extends CommandSender, ForwardingAudience.Single`
- `@NotNull @NotNull CommandSender getCaller()`
- `@NotNull @NotNull CommandSender getCallee()`
- `default void sendMessage(@NotNull @NotNull Component message, @NotNull ChatType.Bound boundChatType)`
- `default void sendMessage(@NotNull @NotNull Component message)`
- `default void sendMessage(@NotNull @NotNull SignedMessage signedMessage, @NotNull ChatType.Bound boundChatType)`
- `@NotNull default Audience audience()`
