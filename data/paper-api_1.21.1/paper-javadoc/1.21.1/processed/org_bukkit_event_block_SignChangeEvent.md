---
title: "org.bukkit.event.block.SignChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/SignChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public SignChangeEvent(@NotNull @NotNull Block theBlock, @NotNull @NotNull Player player, @NotNull List<Component> adventure$lines, @NotNull @NotNull Side side)`
- `@Deprecated public SignChangeEvent(@NotNull @NotNull Block theBlock, @NotNull @NotNull Player player, @NotNull List<Component> adventure$lines)`
- `@Deprecated public SignChangeEvent(@NotNull @NotNull Block theBlock, @NotNull @NotNull Player thePlayer, @NotNull @NotNull String[] theLines)`
- `@Deprecated public SignChangeEvent(@NotNull @NotNull Block theBlock, @NotNull @NotNull Player thePlayer, @NotNull @NotNull String[] theLines, @NotNull @NotNull Side side)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public List<Component> lines()`
- `public @Nullable Component line(int index) throws IndexOutOfBoundsException`
- `public void line(int index, @Nullable Component line) throws IndexOutOfBoundsException`
- `@NotNull @Deprecated public @NotNull String[] getLines()`
- `@Nullable @Deprecated public @Nullable String getLine(int index) throws IndexOutOfBoundsException`
- `@Deprecated public void setLine(int index, @Nullable @Nullable String line) throws IndexOutOfBoundsException`
- `@NotNull public @NotNull Side getSide()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
