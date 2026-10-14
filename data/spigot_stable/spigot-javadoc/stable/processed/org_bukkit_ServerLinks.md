---
title: "org.bukkit.ServerLinks"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/ServerLinks.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ServerLinks**
`public interface ServerLinks`
- `@Nullable ServerLinks.ServerLink getLink(@NotNull ServerLinks.Type type)`
- `@NotNull List<ServerLinks.ServerLink> getLinks()`
- `@NotNull ServerLinks.ServerLink setLink(@NotNull ServerLinks.Type type, @NotNull URI url)`
- `@NotNull ServerLinks.ServerLink addLink(@NotNull ServerLinks.Type type, @NotNull URI url)`
- `@NotNull ServerLinks.ServerLink addLink(@NotNull String displayName, @NotNull URI url)`
- `boolean removeLink(@NotNull ServerLinks.ServerLink link)`
- `@NotNull ServerLinks copy()`
