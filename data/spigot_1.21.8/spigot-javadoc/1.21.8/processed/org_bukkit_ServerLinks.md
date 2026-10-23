---
title: "org.bukkit.ServerLinks"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.ServerLinks`
- `public abstract org.bukkit.ServerLinks$ServerLink getLink(org.bukkit.ServerLinks$Type)`
- `public abstract java.util.List<org.bukkit.ServerLinks$ServerLink> getLinks()`
- `public abstract org.bukkit.ServerLinks$ServerLink setLink(org.bukkit.ServerLinks$Type, java.net.URI)`
- `public abstract org.bukkit.ServerLinks$ServerLink addLink(org.bukkit.ServerLinks$Type, java.net.URI)`
- `public abstract org.bukkit.ServerLinks$ServerLink addLink(java.lang.String, java.net.URI)`
- `public abstract boolean removeLink(org.bukkit.ServerLinks$ServerLink)`
- `public abstract org.bukkit.ServerLinks copy()`
