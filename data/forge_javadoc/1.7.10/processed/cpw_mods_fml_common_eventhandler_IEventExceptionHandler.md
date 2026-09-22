# IEventExceptionHandler

## Class signature

```java
public interface IEventExceptionHandler
```

## Methods

- `void handleException(EventBus bus, Event event, IEventListener [] listeners, int index, java.lang.Throwable throwable)` — Fired when a EventListener throws an exception for the specified event on the event bus.