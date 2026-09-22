---
title: "FurnaceFuelBurnTimeEvent"
description: "public class FurnaceFuelBurnTimeEvent extends Event"
package: "net/minecraftforge/event/furnace"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/furnace/FurnaceFuelBurnTimeEvent.html"
sourceType: javadoc
---

# FurnaceFuelBurnTimeEvent

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event → net.minecraftforge.event.furnace.FurnaceFuelBurnTimeEvent

## Class signature

```java
public class FurnaceFuelBurnTimeEvent extends Event
```

## Constructors

- `FurnaceFuelBurnTimeEvent(ItemStack itemStack, int burnTime)`

## Methods

- `int getBurnTime()` — The resulting value of this event, the burn time for the ItemStack.
- `ItemStack getItemStack()` — Get the ItemStack "fuel" in question.
- `void setBurnTime(int burnTime)` — Set the burn time for the given ItemStack.
