---
title: "IEventExceptionHandler"
description: "public interface IEventExceptionHandler"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/eventhandler/IEventExceptionHandler.html"
sourceType: javadoc
---

# IEventExceptionHandler

## Class signature

```java
public interface IEventExceptionHandler
```

## Methods

- `void handleException(EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)` — Fired when a EventListener throws an exception for the specified event on the event bus.
