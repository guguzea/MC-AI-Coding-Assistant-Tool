---
title: "org.bukkit.event.block.SignChangeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/SignChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class SignChangeEvent**
`public class SignChangeEvent extends BlockEvent implements Cancellable`
- `@Deprecated(since="1.19.4") public SignChangeEvent(@NotNull Block theBlock, @NotNull Player thePlayer, @NotNull String[] theLines)`
- `public SignChangeEvent(@NotNull Block theBlock, @NotNull Player thePlayer, @NotNull String[] theLines, @NotNull Side side)`
- `@NotNull public Player getPlayer()`
- `@NotNull public String[] getLines()`
- `@Nullable public String getLine(int index) throws IndexOutOfBoundsException`
- `public void setLine(int index, @Nullable String line) throws IndexOutOfBoundsException`
- `@NotNull public Side getSide()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
