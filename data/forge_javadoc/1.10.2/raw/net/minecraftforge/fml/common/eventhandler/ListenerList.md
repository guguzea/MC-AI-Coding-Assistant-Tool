---
title: "ListenerList"
description: "public class ListenerList extends java.lang.Object"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/fml/common/eventhandler/ListenerList.html"
sourceType: javadoc
---

# ListenerList

## Class signature

```java
public class ListenerList extends java.lang.Object
```

## Constructors

- `public ListenerList()`
- `public ListenerList( ListenerList parent)`

## Methods

- `public static void resize(int max)`
- `public void resizeLists(int max)`
- `public static void clearBusID(int id)`
- `protected net.minecraftforge.fml.common.eventhandler.ListenerList.ListenerListInst getInstance(int id)`
- `public IEventListener [] getListeners(int id)`
- `public void register(int id, EventPriority priority, IEventListener listener)`
- `public void unregister(int id, IEventListener listener)`
- `public static void unregisterAll(int id, IEventListener listener)`
