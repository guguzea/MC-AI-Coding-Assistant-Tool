---
title: "io.papermc.paper.command.brigadier.CommandSourceStack"
package: "io.papermc.paper.command.brigadier"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/CommandSourceStack.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CommandSourceStack**
`@NonExtendable public interface CommandSourceStack`
- `Location getLocation()`
- `CommandSender getSender()`
- `@Nullable Entity getExecutor()`
- `Player getPlayerOrThrow() throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `Entity getEntityOrThrow() throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `CommandSourceStack withLocation(Location location)`
- `CommandSourceStack withExecutor(Entity executor)`
