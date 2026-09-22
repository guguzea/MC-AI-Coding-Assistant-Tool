---
title: "IEventExceptionHandler"
description: "public interface IEventExceptionHandler"
package: "cpw/mods/fml/common/eventhandler"
version: "1.7.10"
forgeBuild: "10.13.4.1614"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/eventhandler/IEventExceptionHandler.html"
sourceType: javadoc
---

# IEventExceptionHandler

## Class signature

```java
public interface IEventExceptionHandler
```

## Methods

- `void handleException(EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)` — Fired when a EventListener throws an exception for the specified event on the event bus.
