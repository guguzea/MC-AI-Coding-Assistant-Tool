---
title: "EntitySelectorEvent"
description: "public class EntitySelectorEvent extends Event"
package: "net/minecraftforge/event"
version: "1.10.2"
forgeBuild: "12.18.3.2185"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/EntitySelectorEvent.html"
sourceType: javadoc
---

# EntitySelectorEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.EntitySelectorEvent

## Class signature

```java
public class EntitySelectorEvent extends Event
```

## Constructors

- `EntitySelectorEvent(java.util.Map<java.lang.String, java.lang.String> map, java.lang.String mainSelector, ICommandSender sender, Vec3d position)`

## Methods

- `void addPredicate(com.google.common.base.Predicate<Entity> selector)` — Add your custom selector.
- `java.util.Map<java.lang.String, java.lang.String> getArgumentMap()` — Example: "@a[test=true]" would result in a map with "test"=>"true"
- `java.lang.String getMainSelector()`
- `Vec3d getPosition()` — See EntitySelector.getPosFromArguments(Map, Vec3d)
- `ICommandSender getSender()`
