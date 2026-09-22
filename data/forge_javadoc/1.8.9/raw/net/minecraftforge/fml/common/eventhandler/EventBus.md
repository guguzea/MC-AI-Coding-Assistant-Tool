---
title: "EventBus"
description: "public class EventBus extends java.lang.Object implements IEventExceptionHandler"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/eventhandler/EventBus.html"
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
