# ItemExpireEvent

## Class signature

```java
public class ItemExpireEvent extends ItemEvent
```

## Constructors

- `public ItemExpireEvent( EntityItem entityItem, int extraLife)`

## Description

Event that is fired when an EntityItem's age has reached its maximum lifespan. Canceling this event will prevent the EntityItem from being flagged as dead, thus staying it's removal from the world. If