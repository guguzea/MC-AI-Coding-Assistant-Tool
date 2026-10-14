---
title: "io.papermc.paper.event.player.AbstractChatEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/AbstractChatEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class AbstractChatEvent**
`@NonExtendable @NullMarked public abstract class AbstractChatEvent extends PlayerEvent implements Cancellable`
- `public final Set<Audience> viewers()`
- `public final void renderer(ChatRenderer renderer)`
- `public final ChatRenderer renderer()`
- `public final Component message()`
- `public final void message(Component message)`
- `public final Component originalMessage()`
- `public final SignedMessage signedMessage()`
- `public final boolean isCancelled()`
- `public final void setCancelled(boolean cancel)`
