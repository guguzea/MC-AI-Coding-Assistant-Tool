---
title: "Event"
description: "Base Event class that all other events are derived from"
package: "cpw/mods/fml/common/eventhandler"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/cpw/mods/fml/common/eventhandler/Event.html"
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
- `public EventPriority getPhase()`
- `public void setPhase( EventPriority value)`

## Description

Base Event class that all other events are derived from
