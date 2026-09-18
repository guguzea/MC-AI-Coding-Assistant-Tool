# FMLThrowingEventBus

## Class signature

```java
public class FMLThrowingEventBus extends EventBus
```

## Constructors

- `public FMLThrowingEventBus(SubscriberExceptionHandler exceptionHandler)`

## Description

Event bus that allows exceptions thrown by the exception handler to propagate. TODO remove this in 1.13 and stop using the guava event bus