---
title: "org.bukkit.command.MessageCommandSender"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/command/MessageCommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `default void sendMessage&#8203;(@NotNull @NotNull String[] messages)`
- `default void sendMessage&#8203;(@Nullable @Nullable UUID sender, @NotNull @NotNull String message)`
- `default void sendMessage&#8203;(@Nullable @Nullable UUID sender, @NotNull @NotNull String[] messages)`
- `@NotNull default @NotNull Server getServer()`
- `@NotNull default @NotNull String getName()`
- `default boolean isOp()`
- `default void setOp&#8203;(boolean value)`
- `default boolean isPermissionSet&#8203;(@NotNull @NotNull String name)`
- `default boolean isPermissionSet&#8203;(@NotNull @NotNull Permission perm)`
- `default boolean hasPermission&#8203;(@NotNull @NotNull String name)`
- `default boolean hasPermission&#8203;(@NotNull @NotNull Permission perm)`
- `@NotNull default @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value)`
- `@NotNull default @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin)`
- `@NotNull default @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value, int ticks)`
- `@NotNull default @NotNull PermissionAttachment addAttachment&#8203;(@NotNull @NotNull Plugin plugin, int ticks)`
- `default void removeAttachment&#8203;(@NotNull @NotNull PermissionAttachment attachment)`
- `default void recalculatePermissions()`
- `@NotNull default @NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
- `@NotNull default @NotNull CommandSender.Spigot spigot()`
