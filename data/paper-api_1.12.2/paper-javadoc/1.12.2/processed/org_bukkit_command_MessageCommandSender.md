---
title: "org.bukkit.command.MessageCommandSender"
package: "org.bukkit.command"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/command/MessageCommandSender.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `default PermissionAttachment addAttachment(Plugin plugin)`
- `default PermissionAttachment addAttachment(Plugin plugin, int ticks)`
- `default PermissionAttachment addAttachment(Plugin plugin, String name, boolean value)`
- `default PermissionAttachment addAttachment(Plugin plugin, String name, boolean value, int ticks)`
- `default Set<PermissionAttachmentInfo> getEffectivePermissions()`
- `default String getName()`
- `default Server getServer()`
- `default boolean hasPermission(String name)`
- `default boolean hasPermission(Permission perm)`
- `default boolean isOp()`
- `default boolean isPermissionSet(String name)`
- `default boolean isPermissionSet(Permission perm)`
- `default void recalculatePermissions()`
- `default void removeAttachment(PermissionAttachment attachment)`
- `default void sendMessage(String[] messages)`
- `default void setOp(boolean value)`
- `default CommandSender.Spigot spigot()`
