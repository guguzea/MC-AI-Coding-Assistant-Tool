---
title: "io.papermc.paper.event.world.WorldGameRuleChangeEvent"
package: "io.papermc.paper.event.world"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/world/WorldGameRuleChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class WorldGameRuleChangeEvent**
`@NullMarked public class WorldGameRuleChangeEvent extends WorldEvent implements Cancellable`
- `protected final GameRule<?> gameRule`
- `@Internal public WorldGameRuleChangeEvent(World world, @Nullable CommandSender commandSender, GameRule<?> gameRule, String value)`
- `public @Nullable CommandSender getCommandSender()`
- `public GameRule<?> getGameRule()`
- `public String getValue()`
- `public void setValue(String value)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
