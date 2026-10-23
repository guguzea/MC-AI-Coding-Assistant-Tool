---
title: "org.bukkit.ServerLinks"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.ServerLinks`
- `public abstract org.bukkit.ServerLinks$ServerLink getLink(org.bukkit.ServerLinks$Type)`
- `public abstract java.util.List<org.bukkit.ServerLinks$ServerLink> getLinks()`
- `public abstract org.bukkit.ServerLinks$ServerLink setLink(org.bukkit.ServerLinks$Type, java.net.URI)`
- `public abstract org.bukkit.ServerLinks$ServerLink addLink(org.bukkit.ServerLinks$Type, java.net.URI)`
- `public abstract org.bukkit.ServerLinks$ServerLink addLink(java.lang.String, java.net.URI)`
- `public abstract boolean removeLink(org.bukkit.ServerLinks$ServerLink)`
- `public abstract org.bukkit.ServerLinks copy()`
