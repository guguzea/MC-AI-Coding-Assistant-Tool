---
title: "com.destroystokyo.paper.event.brigadier.AsyncPlayerSendCommandsEvent"
package: "com.destroystokyo.paper.event.brigadier"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/event/brigadier/AsyncPlayerSendCommandsEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AsyncPlayerSendCommandsEvent<S extends CommandSourceStack>**
`@Experimental @NullMarked public class AsyncPlayerSendCommandsEvent<S extends CommandSourceStack> extends PlayerEvent`
- `@Internal public AsyncPlayerSendCommandsEvent(Player player, com.mojang.brigadier.tree.RootCommandNode<S> node, boolean hasFiredAsync)`
- `public com.mojang.brigadier.tree.RootCommandNode<S> getCommandNode()`
- `public boolean hasFiredAsync()`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
