---
title: "org.bukkit.inventory.meta.WritableBookMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.inventory.meta.WritableBookMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract boolean hasPages()`
- `public abstract java.lang.String getPage(int)`
- `public abstract void setPage(int, java.lang.String)`
- `public abstract java.util.List<java.lang.String> getPages()`
- `public abstract void setPages(java.util.List<java.lang.String>)`
- `public abstract void setPages(java.lang.String...)`
- `public abstract void addPage(java.lang.String...)`
- `public abstract int getPageCount()`
- `public abstract org.bukkit.inventory.meta.WritableBookMeta clone()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
