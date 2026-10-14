---
title: "io.papermc.paper.registry.data.InstrumentRegistryEntry"
package: "io.papermc.paper.registry.data"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/InstrumentRegistryEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface InstrumentRegistryEntry**
`@NonExtendable public interface InstrumentRegistryEntry`
- `@Contract(pure=true) RegistryHolder<Sound, SoundEventRegistryEntry> soundEvent()`
- `@Contract(pure=true) @NonNegative float duration()`
- `@Contract(pure=true) @Positive float range()`
- `@Contract(pure=true) @NonNegative int durabilityDamage()`
- `@Contract(pure=true) Component description()`
