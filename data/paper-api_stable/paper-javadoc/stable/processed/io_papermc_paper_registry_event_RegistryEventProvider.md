---
title: "io.papermc.paper.registry.event.RegistryEventProvider"
package: "io.papermc.paper.registry.event"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/event/RegistryEventProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryEventProvider<T, B extends RegistryBuilder<T>>**
`@NonExtendable public interface RegistryEventProvider<T, B extends RegistryBuilder<T>>`
- `RegistryEntryAddEventType<T,B> entryAdd()`
- `LifecycleEventType.Prioritizable<BootstrapContext, RegistryComposeEvent<T,B>> compose()`
- `RegistryKey<T> registryKey()`
