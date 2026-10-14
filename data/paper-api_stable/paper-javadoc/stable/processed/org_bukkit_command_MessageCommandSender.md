---
title: "org.bukkit.command.MessageCommandSender"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/26.3/org/bukkit/command/MessageCommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MessageCommandSender**
`@Deprecated(forRemoval=true) public interface MessageCommandSender extends CommandSender`
- `default void sendMessage(@NotNull @NotNull String @NotNull [] messages)`
- `default void sendMessage(@Nullable @Nullable UUID sender, @NotNull @NotNull String message)`
- `default void sendMessage(@Nullable @Nullable UUID sender, @NotNull @NotNull String @NotNull [] messages)`
- `@NotNull default @NotNull Server getServer()`
- `default @NotNull Component name()`
- `@NotNull default @NotNull String getName()`
- `default boolean isOp()`
- `default void setOp(boolean value)`
- `default boolean isPermissionSet(@NotNull @NotNull String name)`
- `default boolean isPermissionSet(@NotNull @NotNull Permission perm)`
- `default boolean hasPermission(@NotNull @NotNull String name)`
- `default boolean hasPermission(@NotNull @NotNull Permission perm)`
- `@NotNull default @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value)`
- `@NotNull default @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin)`
- `@NotNull default @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, @NotNull @NotNull String name, boolean value, int ticks)`
- `@NotNull default @NotNull PermissionAttachment addAttachment(@NotNull @NotNull Plugin plugin, int ticks)`
- `default void removeAttachment(@NotNull @NotNull PermissionAttachment attachment)`
- `default void recalculatePermissions()`
- `@NotNull default @NotNull Set<PermissionAttachmentInfo> getEffectivePermissions()`
- `@NotNull default @NotNull CommandSender.Spigot spigot()`
