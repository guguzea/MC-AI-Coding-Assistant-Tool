---
title: "io.papermc.paper.command.brigadier.BasicCommand"
package: "io.papermc.paper.command.brigadier"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/command/brigadier/BasicCommand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BasicCommand**
`@FunctionalInterface public interface BasicCommand`
- `@OverrideOnly void execute(CommandSourceStack commandSourceStack, String[] args) throws com.mojang.brigadier.exceptions.CommandSyntaxException`
- `@OverrideOnly default Collection<String> suggest(CommandSourceStack commandSourceStack, String[] args)`
- `@OverrideOnly default boolean canUse(CommandSender sender)`
- `@OverrideOnly default @Nullable String permission()`
