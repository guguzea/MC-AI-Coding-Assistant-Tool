---
title: "Event"
description: "public class Event extends java.lang.Object"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/fml/common/eventhandler/Event.html"
sourceType: javadoc
---

# Event

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.Event

## Class signature

```java
public class Event extends java.lang.Object
```

## Constructors

- `Event()`

## Methods

- `ListenerList getListenerList()` — Returns a ListenerList object that contains all listeners that are registered to this event.
- `EventPriority getPhase()`
- `Event.Result getResult()` — Returns the value set as the result of this event
- `boolean hasResult()` — Determines if this event expects a significant result value.
- `boolean isCancelable()` — Determine if this function is cancelable at all.
- `boolean isCanceled()` — Determine if this event is canceled and should stop executing.
- `void setCanceled(boolean cancel)` — Sets the cancel state of this event.
- `void setPhase(EventPriority value)`
- `void setResult(Event.Result value)` — Sets the result value for this event, not all events can have a result set, and any attempt to set a result for a event that isn't expecting it will result in a IllegalArgumentException.
- `protected void setup()` — Called by the base constructor, this is used by ASM generated event classes to setup various functionality such as the listener list.
