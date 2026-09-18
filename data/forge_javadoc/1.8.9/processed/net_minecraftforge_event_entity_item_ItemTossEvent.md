# ItemTossEvent

## Class signature

```java
public class ItemTossEvent extends ItemEvent
```

## Constructors

- `public ItemTossEvent( EntityItem entityItem, EntityPlayer player)`

## Description

Event that is fired whenever a player tosses (Q) an item or drag-n-drops a stack of items outside the inventory GUI screens. Canceling the event will stop the items from entering the world, but will n