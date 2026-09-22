---
title: "ListenerList"
description: "public class ListenerList extends java.lang.Object"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.9.4"
forgeBuild: "12.17.0.2051"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/eventhandler/ListenerList.html"
sourceType: javadoc
---

# ListenerList

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.ListenerList

## Class signature

```java
public class ListenerList extends java.lang.Object
```

## Constructors

- `ListenerList()`
- `ListenerList(ListenerList parent)`

## Methods

- `static void clearBusID(int id)`
- `protected net.minecraftforge.fml.common.eventhandler.ListenerList.ListenerListInst getInstance(int id)`
- `IEventListener [] getListeners(int id)`
- `void register(int id, EventPriority priority, IEventListener listener)`
- `static void resize(int max)`
- `void resizeLists(int max)`
- `void unregister(int id, IEventListener listener)`
- `static void unregisterAll(int id, IEventListener listener)`
