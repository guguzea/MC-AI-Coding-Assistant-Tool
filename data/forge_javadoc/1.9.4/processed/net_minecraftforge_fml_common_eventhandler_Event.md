# Event

## Class signature

```java
public class Event extends java.lang.Object
```

## Constructors

- `public Event()`

## Methods

- `public boolean isCancelable()`
- `public boolean isCanceled()`
- `public void setCanceled(boolean cancel)`
- `public boolean hasResult()`
- `public Event.Result getResult()`
- `public void setResult( Event.Result value)`
- `protected void setup()`
- `public ListenerList getListenerList()`
- `@Nullable public EventPriority getPhase()`
- `public void setPhase(@Nonnull EventPriority value)`

## Description

Base Event class that all other events are derived from