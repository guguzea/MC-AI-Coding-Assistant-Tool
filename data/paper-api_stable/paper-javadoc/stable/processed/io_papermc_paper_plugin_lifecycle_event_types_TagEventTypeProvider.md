---
title: "io.papermc.paper.plugin.lifecycle.event.types.TagEventTypeProvider"
package: "io.papermc.paper.plugin.lifecycle.event.types"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/lifecycle/event/types/TagEventTypeProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TagEventTypeProvider**
`@NonExtendable public interface TagEventTypeProvider`
- `<T> LifecycleEventType.Prioritizable<BootstrapContext, ReloadableRegistrarEvent<PreFlattenTagRegistrar<T>>> preFlatten(RegistryKey<T> registryKey)`
- `<T> LifecycleEventType.Prioritizable<BootstrapContext, ReloadableRegistrarEvent<PostFlattenTagRegistrar<T>>> postFlatten(RegistryKey<T> registryKey)`
