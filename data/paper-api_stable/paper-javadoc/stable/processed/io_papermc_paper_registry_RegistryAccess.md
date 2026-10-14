---
title: "io.papermc.paper.registry.RegistryAccess"
package: "io.papermc.paper.registry"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/RegistryAccess.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface RegistryAccess**
`@NullMarked @NonExtendable public interface RegistryAccess`
- `static RegistryAccess registryAccess()`
- `@Deprecated(since="1.20.6", forRemoval=true) <T extends Keyed> @Nullable Registry<T> getRegistry(Class<T> type)`
- `<T extends Keyed> Registry<T> getRegistry(RegistryKey<T> registryKey)`
