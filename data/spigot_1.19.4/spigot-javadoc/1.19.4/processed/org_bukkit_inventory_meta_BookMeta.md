---
title: "org.bukkit.inventory.meta.BookMeta"
package: "org.bukkit.inventory.meta"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.inventory.meta.BookMeta extends org.bukkit.inventory.meta.ItemMeta`
- `public abstract boolean hasTitle()`
- `public abstract java.lang.String getTitle()`
- `public abstract boolean setTitle(java.lang.String)`
- `public abstract boolean hasAuthor()`
- `public abstract java.lang.String getAuthor()`
- `public abstract void setAuthor(java.lang.String)`
- `public abstract boolean hasGeneration()`
- `public abstract org.bukkit.inventory.meta.BookMeta$Generation getGeneration()`
- `public abstract void setGeneration(org.bukkit.inventory.meta.BookMeta$Generation)`
- `public abstract boolean hasPages()`
- `public abstract java.lang.String getPage(int)`
- `public abstract void setPage(int, java.lang.String)`
- `public abstract java.util.List<java.lang.String> getPages()`
- `public abstract void setPages(java.util.List<java.lang.String>)`
- `public abstract void setPages(java.lang.String...)`
- `public abstract void addPage(java.lang.String...)`
- `public abstract int getPageCount()`
- `public abstract org.bukkit.inventory.meta.BookMeta clone()`
- `public abstract org.bukkit.inventory.meta.BookMeta$Spigot spigot()`
- `public default org.bukkit.inventory.meta.ItemMeta clone()`
- `public default java.lang.Object clone() throws java.lang.CloneNotSupportedException`
