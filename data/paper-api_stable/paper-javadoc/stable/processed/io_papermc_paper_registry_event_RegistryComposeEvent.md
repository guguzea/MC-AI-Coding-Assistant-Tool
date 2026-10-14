---
title: "io.papermc.paper.registry.event.RegistryComposeEvent"
package: "io.papermc.paper.registry.event"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/event/RegistryComposeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryComposeEvent<T, B extends RegistryBuilder<T>>**
`@NonExtendable public interface RegistryComposeEvent<T, B extends RegistryBuilder<T>> extends RegistryEvent<T>`
- `WritableRegistry<T,B> registry()`
- `<V extends Keyed> Tag<V> getOrCreateTag(TagKey<V> tagKey)`
