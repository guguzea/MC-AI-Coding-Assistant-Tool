---
title: "EventBus"
description: "public class EventBus extends java.lang.Object implements IEventExceptionHandler"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/eventhandler/EventBus.html"
sourceType: javadoc
---

# EventBus

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.EventBus

## Class signature

```java
public class EventBus extends java.lang.Object implements IEventExceptionHandler
```

## Constructors

- `EventBus()`
- `EventBus(IEventExceptionHandler handler)`

## Methods

- `void handleException(EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)` — Fired when a EventListener throws an exception for the specified event on the event bus.
- `boolean post(Event event)`
- `void register(java.lang.Object target)`
- `void unregister(java.lang.Object object)`
