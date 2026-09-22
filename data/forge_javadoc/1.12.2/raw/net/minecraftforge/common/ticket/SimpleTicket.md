---
title: "SimpleTicket"
description: "public abstract class SimpleTicket<T> extends java.lang.Object"
package: "net/minecraftforge/common/ticket"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/ticket/SimpleTicket.html"
sourceType: javadoc
---

# SimpleTicket

**Inheritance:** java.lang.Object → net.minecraftforge.common.ticket.SimpleTicket<T>

## Class signature

```java
public abstract class SimpleTicket<T> extends java.lang.Object
```

## Constructors

- `SimpleTicket()`

## Methods

- `protected void forEachManager(java.util.function.Consumer<ITicketManager<T>> consumer)`
- `protected ITicketManager<T>[] getDummyManagers()`
- `protected ITicketManager<T> getMasterManager()`
- `void invalidate()` — Removes the ticket from the managing system.
- `boolean isValid()` — Checks if your ticket is still registered in the system.
- `abstract boolean matches(T toMatch)`
- `@Deprecated void setBackend(ITicketManager<T> ticketManager)`
- `void setManager(ITicketManager<T> masterManager, ITicketManager<T>... dummyManagers)` — Internal method that sets the collection from the managing system.
- `boolean unload(ITicketManager<T> unloadingManager)` — Called by the managing system when a ticket wishes to unload all of it's tickets, e.g. on chunk unload The ticket must not remove itself from the manager that is calling the unload!
- `void validate()` — Re-adds your ticket to the system.

## Fields

- `protected boolean isValid`
