---
title: "io.papermc.paper.registry.event.RegistryEntryAddEvent"
package: "io.papermc.paper.registry.event"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/event/RegistryEntryAddEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryEntryAddEvent<T, B extends RegistryBuilder<T>>**
`@NonExtendable public interface RegistryEntryAddEvent<T, B extends RegistryBuilder<T>> extends RegistryEvent<T>`
- `B builder()`
- `TypedKey<T> key()`
- `<V extends Keyed> Tag<V> getOrCreateTag(TagKey<V> tagKey)`
