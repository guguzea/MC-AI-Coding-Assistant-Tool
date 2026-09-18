# PlayerOpenContainerEvent

## Class signature

```java
public class PlayerOpenContainerEvent extends PlayerEvent
```

## Constructors

- `public PlayerOpenContainerEvent( EntityPlayer player, Container openContainer)`

## Methods

- `public boolean isCanInteractWith()`

## Description

This event is fired when a player attempts to view a container during player tick. setResult ALLOW to allow the container to stay open setResult DENY to force close the container (denying access) DEFA