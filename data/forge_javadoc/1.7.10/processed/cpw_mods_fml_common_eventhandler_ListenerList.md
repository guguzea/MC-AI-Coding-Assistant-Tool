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
- `protected cpw.mods.fml.common.eventhandler.ListenerList.ListenerListInst getInstance(int id)`
- `public IEventListener [] getListeners(int id)`
- `public void register(int id, EventPriority priority, IEventListener listener)`
- `public void unregister(int id, IEventListener listener)`
- `public static void unregisterAll(int id, IEventListener listener)`