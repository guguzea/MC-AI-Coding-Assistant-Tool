---
title: "InputUpdateEvent"
description: "This event is fired after player movement inputs are updated. Handlers can freely manipulate MovementInput to cancel movement."
package: "net/minecraftforge/client/event"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/event/InputUpdateEvent.html"
sourceType: javadoc
---

# InputUpdateEvent

## Class signature

```java
public class InputUpdateEvent extends PlayerEvent
```

## Constructors

- `public InputUpdateEvent( EntityPlayer player, MovementInput movementInput)`

## Methods

- `public MovementInput getMovementInput()`

## Description

This event is fired after player movement inputs are updated. Handlers can freely manipulate MovementInput to cancel movement.
