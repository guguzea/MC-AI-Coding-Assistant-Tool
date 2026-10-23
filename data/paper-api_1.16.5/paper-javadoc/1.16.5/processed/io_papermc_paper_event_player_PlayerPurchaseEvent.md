---
title: "io.papermc.paper.event.player.PlayerPurchaseEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.16.5/io/papermc/paper/event/player/PlayerPurchaseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public PlayerPurchaseEvent&#8203;(@NotNull @NotNull Player player, @NotNull @NotNull MerchantRecipe trade, boolean rewardExp, boolean increaseTradeUses)`
- `@NotNull public @NotNull MerchantRecipe getTrade()`
- `public void setTrade&#8203;(@NotNull @NotNull MerchantRecipe trade)`
- `public boolean isRewardingExp()`
- `public void setRewardExp&#8203;(boolean rewardExp)`
- `public boolean willIncreaseTradeUses()`
- `public void setIncreaseTradeUses&#8203;(boolean increaseTradeUses)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
