---
title: "org.bukkit.event.block.NotePlayEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/block/NotePlayEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class NotePlayEvent**
`public class NotePlayEvent extends BlockEvent implements Cancellable`
- `@Internal public NotePlayEvent(@NotNull @NotNull Block block, @NotNull @NotNull Instrument instrument, @NotNull @NotNull Note note)`
- `@NotNull public @NotNull Instrument getInstrument()`
- `@NotNull public @NotNull Note getNote()`
- `public void setInstrument(@NotNull @NotNull Instrument instrument)`
- `public void setNote(@NotNull @NotNull Note note)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
