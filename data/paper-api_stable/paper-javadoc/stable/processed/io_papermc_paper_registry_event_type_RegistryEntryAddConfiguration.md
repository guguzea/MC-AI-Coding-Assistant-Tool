---
title: "io.papermc.paper.registry.event.type.RegistryEntryAddConfiguration"
package: "io.papermc.paper.registry.event.type"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/event/type/RegistryEntryAddConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryEntryAddConfiguration<T>**
`@NonExtendable public interface RegistryEntryAddConfiguration<T> extends PrioritizedLifecycleEventHandlerConfiguration<BootstrapContext>`
- `@Contract(value="_ -> this", mutates="this") default RegistryEntryAddConfiguration<T> filter(TypedKey<T> key)`
- `@Contract(value="_ -> this", mutates="this") RegistryEntryAddConfiguration<T> filter(Predicate<TypedKey<T>> filter)`
- `RegistryEntryAddConfiguration<T> priority(int priority)`
- `RegistryEntryAddConfiguration<T> monitor()`
