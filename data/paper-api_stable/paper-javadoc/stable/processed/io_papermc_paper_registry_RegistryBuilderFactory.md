---
title: "io.papermc.paper.registry.RegistryBuilderFactory"
package: "io.papermc.paper.registry"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/RegistryBuilderFactory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryBuilderFactory<T, B extends RegistryBuilder<T>>**
`@NullMarked @NonExtendable public interface RegistryBuilderFactory<T, B extends RegistryBuilder<T>>`
- `@Contract("-> new") B empty()`
- `@Contract("_ -> new") B copyFrom(TypedKey<T> key)`
