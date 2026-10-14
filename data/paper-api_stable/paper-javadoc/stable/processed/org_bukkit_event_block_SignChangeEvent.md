---
title: "org.bukkit.event.block.SignChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/SignChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class SignChangeEvent**
`public class SignChangeEvent extends BlockEvent implements Cancellable`
- `@Internal public SignChangeEvent(@NotNull @NotNull Block sign, @NotNull @NotNull Player player, @NotNull List<Component> adventure$lines, @NotNull @NotNull Side side)`
- `@Internal @Deprecated(forRemoval=true) public SignChangeEvent(@NotNull @NotNull Block sign, @NotNull @NotNull Player player, @NotNull List<Component> adventure$lines)`
- `@Internal @Deprecated(since="1.19.4", forRemoval=true) public SignChangeEvent(@NotNull @NotNull Block sign, @NotNull @NotNull Player thePlayer, @NotNull @NotNull String[] theLines)`
- `@Internal @Deprecated(forRemoval=true) public SignChangeEvent(@NotNull @NotNull Block sign, @NotNull @NotNull Player thePlayer, @NotNull @NotNull String[] theLines, @NotNull @NotNull Side side)`
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
