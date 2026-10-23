---
title: "io.papermc.paper.registry.event.type.RegistryEntryAddConfiguration"
package: "io.papermc.paper.registry.event.type"
source: https://jd.papermc.io/paper/1.21.1/io/papermc/paper/registry/event/type/RegistryEntryAddConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> this", mutates="this") default RegistryEntryAddConfiguration<T> filter(TypedKey<T> key)`
- `@Contract(value="_ -> this", mutates="this") RegistryEntryAddConfiguration<T> filter(Predicate<TypedKey<T>> filter)`
- `RegistryEntryAddConfiguration<T> priority(int priority)`
- `RegistryEntryAddConfiguration<T> monitor()`
