---
title: "EventBus"
description: "Fired when a EventListener throws an exception for the specified event on the event bus."
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraftforge/fml/common/eventhandler/EventBus.html"
sourceType: javadoc
---

# EventBus

## Class signature

```java
public class EventBus extends java.lang.Object implements IEventExceptionHandler
```

## Constructors

- `public EventBus()`
- `public EventBus(@Nonnull IEventExceptionHandler handler)`

## Methods

- `public void register(java.lang.Object target)`
- `public void unregister(java.lang.Object object)`
- `public boolean post( Event event)`
- `public void handleException( EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)`

## Description

Fired when a EventListener throws an exception for the specified event on the event bus.
