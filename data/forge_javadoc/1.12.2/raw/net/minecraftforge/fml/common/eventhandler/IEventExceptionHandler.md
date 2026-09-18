---
title: "IEventExceptionHandler"
description: "Fired when a EventListener throws an exception for the specified event on the event bus."
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/eventhandler/IEventExceptionHandler.html"
sourceType: javadoc
---

# IEventExceptionHandler

## Class signature

```java
public interface IEventExceptionHandler
```

## Methods

- `void handleException( EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)`

## Description

Fired when a EventListener throws an exception for the specified event on the event bus.
