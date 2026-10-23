---
title: "org.bukkit.event.block.SignChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/SignChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public SignChangeEvent&#8203;(@NotNull @NotNull Block theBlock, @NotNull @NotNull Player player, @NotNull List<Component> adventure$lines)`
- `@Deprecated public SignChangeEvent&#8203;(@NotNull @NotNull Block theBlock, @NotNull @NotNull Player thePlayer, @NotNull @NotNull String[] theLines)`
- `@NotNull public @NotNull Player getPlayer()`
- `@NotNull public List<Component> lines()`
- `@Nullable public Component line&#8203;(int index) throws IndexOutOfBoundsException`
- `public void line&#8203;(int index, @Nullable Component line) throws IndexOutOfBoundsException`
- `@NotNull @Deprecated public @NotNull String[] getLines()`
- `@Nullable @Deprecated public @Nullable String getLine&#8203;(int index) throws IndexOutOfBoundsException`
- `@Deprecated public void setLine&#8203;(int index, @Nullable @Nullable String line) throws IndexOutOfBoundsException`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
