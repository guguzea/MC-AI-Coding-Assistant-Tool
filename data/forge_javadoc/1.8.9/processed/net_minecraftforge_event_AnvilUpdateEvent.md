# AnvilUpdateEvent

## Class signature

```java
public class AnvilUpdateEvent extends Event
```

## Constructors

- `public AnvilUpdateEvent( ItemStack left, ItemStack right, java.lang.String name, int cost)`

## Description

AnvilUpdateEvent is fired when a player places items in both the left and right slots of a anvil. If the event is canceled, vanilla behavior will not run, and the output will be set to null. If the ev