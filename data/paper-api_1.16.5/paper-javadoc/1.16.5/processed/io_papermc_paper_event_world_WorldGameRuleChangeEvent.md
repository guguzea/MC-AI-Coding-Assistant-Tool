---
title: "io.papermc.paper.event.world.WorldGameRuleChangeEvent"
package: "io.papermc.paper.event.world"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/world/WorldGameRuleChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public WorldGameRuleChangeEvent&#8203;(@NotNull @NotNull World world, @Nullable @Nullable CommandSender commandSender, @NotNull @NotNull GameRule<?> gameRule, @NotNull @NotNull String value)`
- `@Nullable public @Nullable CommandSender getCommandSender()`
- `@NotNull public @NotNull GameRule<?> getGameRule()`
- `@NotNull public @NotNull String getValue()`
- `public void setValue&#8203;(@NotNull @NotNull String value)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
