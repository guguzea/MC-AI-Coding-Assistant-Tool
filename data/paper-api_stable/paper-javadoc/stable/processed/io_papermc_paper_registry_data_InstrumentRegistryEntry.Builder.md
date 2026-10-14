---
title: "io.papermc.paper.registry.data.InstrumentRegistryEntry.Builder"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/InstrumentRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface InstrumentRegistryEntry.Builder**
`@NonExtendable public static interface InstrumentRegistryEntry.Builder extends InstrumentRegistryEntry, RegistryBuilder<MusicInstrument>`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder soundEvent(TypedKey<Sound> soundEvent)`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder soundEvent(Consumer<RegistryBuilderFactory<Sound, ? extends SoundEventRegistryEntry.Builder>> soundEvent)`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder soundEvent(RegistryHolder<Sound, SoundEventRegistryEntry> soundEvent)`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder duration(@NonNegative float duration)`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder range(@Positive float range)`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder durabilityDamage(@NonNegative int durabilityDamage)`
- `@Contract(value="_ -> this", mutates="this") InstrumentRegistryEntry.Builder description(Component description)`
