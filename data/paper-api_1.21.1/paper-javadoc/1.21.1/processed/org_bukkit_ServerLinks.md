---
title: "org.bukkit.ServerLinks"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/ServerLinks.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable ServerLinks.ServerLink getLink(@NotNull @NotNull ServerLinks.Type type)`
- `@NotNull @NotNull List<ServerLinks.ServerLink> getLinks()`
- `@NotNull @NotNull ServerLinks.ServerLink setLink(@NotNull @NotNull ServerLinks.Type type, @NotNull @NotNull URI url)`
- `@NotNull @NotNull ServerLinks.ServerLink addLink(@NotNull @NotNull ServerLinks.Type type, @NotNull @NotNull URI url)`
- `@NotNull @NotNull ServerLinks.ServerLink addLink(@NotNull Component displayName, @NotNull @NotNull URI url)`
- `@Deprecated @NotNull @NotNull ServerLinks.ServerLink addLink(@NotNull @NotNull String displayName, @NotNull @NotNull URI url)`
- `boolean removeLink(@NotNull @NotNull ServerLinks.ServerLink link)`
- `@NotNull @NotNull ServerLinks copy()`
