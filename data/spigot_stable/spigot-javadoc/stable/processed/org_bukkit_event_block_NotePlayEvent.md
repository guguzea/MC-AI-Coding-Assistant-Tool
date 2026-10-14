---
title: "org.bukkit.event.block.NotePlayEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/NotePlayEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class NotePlayEvent**
`public class NotePlayEvent extends BlockEvent implements Cancellable`
- `public NotePlayEvent(@NotNull Block block, @NotNull Instrument instrument, @NotNull Note note)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Instrument getInstrument()`
- `@NotNull public Note getNote()`
- `@Deprecated(since="1.13") public void setInstrument(@NotNull Instrument instrument)`
- `@Deprecated(since="1.13") public void setNote(@NotNull Note note)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
