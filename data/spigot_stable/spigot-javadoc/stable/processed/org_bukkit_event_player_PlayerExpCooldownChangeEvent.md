---
title: "org.bukkit.event.player.PlayerExpCooldownChangeEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerExpCooldownChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerExpCooldownChangeEvent**
`public class PlayerExpCooldownChangeEvent extends PlayerEvent`
- `public PlayerExpCooldownChangeEvent(@NotNull Player player, int newcooldown, @NotNull PlayerExpCooldownChangeEvent.ChangeReason reason)`
- `@NotNull public PlayerExpCooldownChangeEvent.ChangeReason getReason()`
- `public int getNewCooldown()`
- `public void setNewCooldown(int newCooldown)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
