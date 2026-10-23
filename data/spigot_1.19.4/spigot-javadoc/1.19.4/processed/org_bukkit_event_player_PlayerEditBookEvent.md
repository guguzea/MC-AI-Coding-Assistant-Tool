---
title: "org.bukkit.event.player.PlayerEditBookEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
