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