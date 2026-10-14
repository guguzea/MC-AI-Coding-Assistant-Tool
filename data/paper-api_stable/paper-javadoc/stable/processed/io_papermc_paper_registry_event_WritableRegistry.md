---
title: "io.papermc.paper.registry.event.WritableRegistry"
package: "io.papermc.paper.registry.event"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/event/WritableRegistry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface WritableRegistry<T, B extends RegistryBuilder<T>>**
`@NonExtendable public interface WritableRegistry<T, B extends RegistryBuilder<T>>`
- `default void register(TypedKey<T> key, Consumer<? super B> value)`
- `void registerWith(TypedKey<T> key, Consumer<RegistryBuilderFactory<T,B>> value)`
