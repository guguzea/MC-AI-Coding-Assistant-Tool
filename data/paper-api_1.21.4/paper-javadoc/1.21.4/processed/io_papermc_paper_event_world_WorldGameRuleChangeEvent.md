---
title: "io.papermc.paper.event.world.WorldGameRuleChangeEvent"
package: "io.papermc.paper.event.world"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/event/world/WorldGameRuleChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Internal public WorldGameRuleChangeEvent(World world, @Nullable CommandSender commandSender, GameRule<?> gameRule, String value)`
- `public @Nullable CommandSender getCommandSender()`
- `public GameRule<?> getGameRule()`
- `public String getValue()`
- `public void setValue(String value)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
