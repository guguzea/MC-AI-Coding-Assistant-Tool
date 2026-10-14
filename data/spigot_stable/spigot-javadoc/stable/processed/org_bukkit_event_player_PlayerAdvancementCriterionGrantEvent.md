---
title: "org.bukkit.event.player.PlayerAdvancementCriterionGrantEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerAdvancementCriterionGrantEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerAdvancementCriterionGrantEvent**
`public class PlayerAdvancementCriterionGrantEvent extends PlayerEvent implements Cancellable`
- `public PlayerAdvancementCriterionGrantEvent(@NotNull Player who, @NotNull Advancement advancement, @NotNull String criterion)`
- `@NotNull public String getCriterion()`
- `@NotNull public Advancement getAdvancement()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlersLists()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
