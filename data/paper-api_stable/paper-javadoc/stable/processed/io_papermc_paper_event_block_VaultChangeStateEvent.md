---
title: "io.papermc.paper.event.block.VaultChangeStateEvent"
package: "io.papermc.paper.event.block"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/block/VaultChangeStateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class VaultChangeStateEvent**
`@NullMarked public class VaultChangeStateEvent extends BlockEvent implements Cancellable`
- `@Internal public VaultChangeStateEvent(Block vaultBlock, @Nullable Player player, Vault.State currentState, Vault.State newState)`
- `public @Nullable Player getPlayer()`
- `public Vault.State getCurrentState()`
- `public Vault.State getNewState()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
