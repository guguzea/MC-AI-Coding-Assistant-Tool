---
title: "io.papermc.paper.plugin.lifecycle.event.LifecycleEventManager"
package: "io.papermc.paper.plugin.lifecycle.event"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/plugin/lifecycle/event/LifecycleEventManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface LifecycleEventManager<O extends LifecycleEventOwner>**
`@NonExtendable public interface LifecycleEventManager<O extends LifecycleEventOwner>`
- `default <E extends LifecycleEvent> void registerEventHandler(LifecycleEventType<? super O, ? extends E, ?> eventType, LifecycleEventHandler<? super E> eventHandler)`
- `void registerEventHandler(LifecycleEventHandlerConfiguration<? super O> handlerConfiguration)`
