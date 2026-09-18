---
title: "SimpleTicket"
description: "Common class for a simple ticket based system."
package: "net/minecraftforge/common/ticket"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/ticket/SimpleTicket.html"
sourceType: javadoc
---

# SimpleTicket

## Class signature

```java
public abstract class SimpleTicket<T> extends java.lang.Object
```

## Constructors

- `public SimpleTicket()`

## Methods

- `@Deprecated public final void setBackend( ITicketManager < T > ticketManager)`
- `@SafeVarargs public final void setManager( ITicketManager < T > masterManager, ITicketManager < T >... dummyManagers)`
- `public boolean isValid()`
- `public void invalidate()`
- `public boolean unload( ITicketManager < T > unloadingManager)`
- `public void validate()`
- `public abstract boolean matches( T toMatch)`
- `protected final void forEachManager(java.util.function.Consumer< ITicketManager < T >> consumer)`
- `protected final ITicketManager < T > getMasterManager()`
- `protected final ITicketManager < T >[] getDummyManagers()`

## Description

Common class for a simple ticket based system.
