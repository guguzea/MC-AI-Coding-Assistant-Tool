# EventBus

## Class signature

```java
public class EventBus extends java.lang.Object implements IEventExceptionHandler
```

## Constructors

- `public EventBus()`
- `public EventBus( IEventExceptionHandler handler)`

## Methods

- `public void register(java.lang.Object target)`
- `public void unregister(java.lang.Object object)`
- `public boolean post( Event event)`
- `public void shutdown()`
- `public void handleException( EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)`

## Description

Fired when a EventListener throws an exception for the specified event on the event bus.