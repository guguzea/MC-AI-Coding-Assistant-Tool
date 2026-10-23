---
title: "com.destroystokyo.paper.event.brigadier.CommandRegisteredEvent"
package: "com.destroystokyo.paper.event.brigadier"
source: https://jd.papermc.io/paper/1.21.4/com/destroystokyo/paper/event/brigadier/CommandRegisteredEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public CommandRegisteredEvent(String commandLabel, BukkitBrigadierCommand<S> brigadierCommand, Command command, com.mojang.brigadier.tree.RootCommandNode<S> root, com.mojang.brigadier.tree.LiteralCommandNode<S> literal, com.mojang.brigadier.tree.ArgumentCommandNode<S,String> defaultArgs)`
- `public String getCommandLabel()`
- `public BukkitBrigadierCommand<S> getBrigadierCommand()`
- `public Command getCommand()`
- `public com.mojang.brigadier.tree.RootCommandNode<S> getRoot()`
- `public com.mojang.brigadier.tree.ArgumentCommandNode<S,String> getDefaultArgs()`
- `public com.mojang.brigadier.tree.LiteralCommandNode<S> getLiteral()`
- `public void setLiteral(com.mojang.brigadier.tree.LiteralCommandNode<S> literal)`
- `public boolean isRawCommand()`
- `public void setRawCommand(boolean rawCommand)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
