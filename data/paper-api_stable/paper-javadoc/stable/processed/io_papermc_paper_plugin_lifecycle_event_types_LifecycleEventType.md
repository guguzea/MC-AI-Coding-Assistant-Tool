---
title: "io.papermc.paper.plugin.lifecycle.event.types.LifecycleEventType"
package: "io.papermc.paper.plugin.lifecycle.event.types"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/lifecycle/event/types/LifecycleEventType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface LifecycleEventType<O extends LifecycleEventOwner, E extends LifecycleEvent, C extends LifecycleEventHandlerConfiguration<O>>**
`@NonExtendable public interface LifecycleEventType<O extends LifecycleEventOwner, E extends LifecycleEvent, C extends LifecycleEventHandlerConfiguration<O>>`
- `@Contract(pure=true) String name()`
- `@Contract("_ -> new") C newHandler(LifecycleEventHandler<? super E> handler)`
