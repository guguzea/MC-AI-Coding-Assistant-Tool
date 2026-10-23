---
title: "org.bukkit.event.player.PlayerExpChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/event/player/PlayerExpChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public PlayerExpChangeEvent(@NotNull @NotNull Player player, int expAmount)`
- `public PlayerExpChangeEvent(@NotNull @NotNull Player player, @Nullable @Nullable Entity sourceEntity, int expAmount)`
- `@Nullable public @Nullable Entity getSource()`
- `public int getAmount()`
- `public void setAmount(int amount)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
