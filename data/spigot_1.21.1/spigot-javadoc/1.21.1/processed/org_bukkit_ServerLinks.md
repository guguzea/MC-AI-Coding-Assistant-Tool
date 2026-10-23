---
title: "org.bukkit.ServerLinks"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.ServerLinks`
- `public abstract org.bukkit.ServerLinks$ServerLink getLink(org.bukkit.ServerLinks$Type)`
- `public abstract java.util.List<org.bukkit.ServerLinks$ServerLink> getLinks()`
- `public abstract org.bukkit.ServerLinks$ServerLink setLink(org.bukkit.ServerLinks$Type, java.net.URI)`
- `public abstract org.bukkit.ServerLinks$ServerLink addLink(org.bukkit.ServerLinks$Type, java.net.URI)`
- `public abstract org.bukkit.ServerLinks$ServerLink addLink(java.lang.String, java.net.URI)`
- `public abstract boolean removeLink(org.bukkit.ServerLinks$ServerLink)`
- `public abstract org.bukkit.ServerLinks copy()`
