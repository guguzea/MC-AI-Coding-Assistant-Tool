---
title: "io.papermc.paper.event.player.PlayerPurchaseEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/event/player/PlayerPurchaseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerPurchaseEvent**
`@NullMarked public class PlayerPurchaseEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerPurchaseEvent(Player player, Merchant merchant, MerchantRecipe trade, boolean rewardExp, boolean increaseTradeUses)`
- `public Merchant getMerchant()`
- `public MerchantRecipe getTrade()`
- `public void setTrade(MerchantRecipe trade)`
- `public boolean isRewardingExp()`
- `public void setRewardExp(boolean rewardExp)`
- `public boolean willIncreaseTradeUses()`
- `public void setIncreaseTradeUses(boolean increaseTradeUses)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `public HandlerList getHandlers()`
- `public static HandlerList getHandlerList()`
