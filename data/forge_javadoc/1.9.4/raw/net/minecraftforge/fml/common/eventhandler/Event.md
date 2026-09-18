---
title: "Event"
description: "Base Event class that all other events are derived from"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/fml/common/eventhandler/Event.html"
sourceType: javadoc
---

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
