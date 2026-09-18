# FMLEvent

## Class signature

```java
public class FMLEvent extends java.lang.Object
```

## Constructors

- `public FMLEvent()`

## Methods

- `public final java.lang.String getEventType()`
- `public final java.lang.String description()`
- `public void applyModContainer( ModContainer activeContainer)`

## Description

Parent type to all FML events. This is based on Guava EventBus. Event Subscription isn't using the Guava annotation however, it's using a custom annotation specific to FML Mod.EventHandler