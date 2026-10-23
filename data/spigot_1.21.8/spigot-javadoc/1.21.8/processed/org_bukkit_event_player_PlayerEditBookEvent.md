---
title: "org.bukkit.event.player.PlayerEditBookEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.event.player.PlayerEditBookEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.PlayerEditBookEvent(org.bukkit.entity.Player, int, org.bukkit.inventory.meta.BookMeta, org.bukkit.inventory.meta.BookMeta, boolean)`
- `public org.bukkit.inventory.meta.BookMeta getPreviousBookMeta()`
- `public org.bukkit.inventory.meta.BookMeta getNewBookMeta()`
- `public int getSlot()`
- `public void setNewBookMeta(org.bukkit.inventory.meta.BookMeta) throws java.lang.IllegalArgumentException`
- `public boolean isSigning()`
- `public void setSigning(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
