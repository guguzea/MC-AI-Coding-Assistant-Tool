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