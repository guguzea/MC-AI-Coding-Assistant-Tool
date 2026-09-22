# ListenerList

**Inheritance:** java.lang.Object → cpw.mods.fml.common.eventhandler.ListenerList

## Class signature

```java
public class ListenerList extends java.lang.Object
```

## Constructors

- `ListenerList()`
- `ListenerList(ListenerList parent)`

## Methods

- `static void clearBusID(int id)`
- `protected cpw.mods.fml.common.eventhandler.ListenerList.ListenerListInst getInstance(int id)`
- `IEventListener [] getListeners(int id)`
- `void register(int id, EventPriority priority, IEventListener listener)`
- `static void resize(int max)`
- `void resizeLists(int max)`
- `void unregister(int id, IEventListener listener)`
- `static void unregisterAll(int id, IEventListener listener)`