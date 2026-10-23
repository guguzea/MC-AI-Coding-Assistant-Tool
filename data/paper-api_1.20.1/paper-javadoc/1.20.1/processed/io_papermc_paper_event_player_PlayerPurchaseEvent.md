---
title: "io.papermc.paper.event.player.PlayerPurchaseEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerPurchaseEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerPurchaseEvent(@NotNull @NotNull Player player, @NotNull @NotNull MerchantRecipe trade, boolean rewardExp, boolean increaseTradeUses)`
- `@NotNull public @NotNull MerchantRecipe getTrade()`
- `public void setTrade(@NotNull @NotNull MerchantRecipe trade)`
- `public boolean isRewardingExp()`
- `public void setRewardExp(boolean rewardExp)`
- `public boolean willIncreaseTradeUses()`
- `public void setIncreaseTradeUses(boolean increaseTradeUses)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
