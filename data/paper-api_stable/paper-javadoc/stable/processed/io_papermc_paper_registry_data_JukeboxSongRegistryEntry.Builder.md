---
title: "io.papermc.paper.registry.data.JukeboxSongRegistryEntry.Builder"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/JukeboxSongRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface JukeboxSongRegistryEntry.Builder**
`@NonExtendable public static interface JukeboxSongRegistryEntry.Builder extends JukeboxSongRegistryEntry, RegistryBuilder<JukeboxSong>`
- `@Contract(value="_ -> this", mutates="this") JukeboxSongRegistryEntry.Builder soundEvent(TypedKey<Sound> soundEvent)`
- `@Contract(value="_ -> this", mutates="this") JukeboxSongRegistryEntry.Builder soundEvent(Consumer<RegistryBuilderFactory<Sound, ? extends SoundEventRegistryEntry.Builder>> soundEvent)`
- `@Contract(value="_ -> this", mutates="this") JukeboxSongRegistryEntry.Builder soundEvent(RegistryHolder<Sound, SoundEventRegistryEntry> soundEvent)`
- `@Contract(value="_ -> this", mutates="this") JukeboxSongRegistryEntry.Builder description(Component description)`
- `@Contract(value="_ -> this", mutates="this") JukeboxSongRegistryEntry.Builder lengthInSeconds(@Positive float lengthInSeconds)`
- `@Contract(value="_ -> this", mutates="this") JukeboxSongRegistryEntry.Builder comparatorOutput(@Range(from=0L,to=15L) int comparatorOutput)`
