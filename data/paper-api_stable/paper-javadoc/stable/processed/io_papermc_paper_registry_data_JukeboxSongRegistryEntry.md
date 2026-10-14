---
title: "io.papermc.paper.registry.data.JukeboxSongRegistryEntry"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/JukeboxSongRegistryEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface JukeboxSongRegistryEntry**
`@NonExtendable public interface JukeboxSongRegistryEntry`
- `@Contract(pure=true) RegistryHolder<Sound, SoundEventRegistryEntry> soundEvent()`
- `@Contract(pure=true) Component description()`
- `@Contract(pure=true) @Positive float lengthInSeconds()`
- `@Contract(pure=true) @Range(from=0L,to=15L) int comparatorOutput()`
