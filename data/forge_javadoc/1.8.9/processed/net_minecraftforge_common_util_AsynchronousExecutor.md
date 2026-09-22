# AsynchronousExecutor

**Inheritance:** java.lang.Object → net.minecraftforge.common.util.AsynchronousExecutor<P, T, C, E>

## Class signature

```java
public final class AsynchronousExecutor<P, T, C, E extends java.lang.Throwable> extends java.lang.Object
```

## Constructors

- `AsynchronousExecutor(AsynchronousExecutor.CallBackProvider<P, T, C, E> provider, int coreSize)`

## Methods

- `void add(P parameter, C callback)` — Adds a callback to the parameter provided, adding parameter to the queue if needed.
- `boolean drop(P parameter, C callback)` — This removes a particular callback from the specified parameter.
- `void finishActive()` — This is the 'heartbeat' that should be called synchronously to finish any pending tasks
- `T get(P parameter)` — This method attempts to skip the waiting period for said parameter.
- `T getSkipQueue(P parameter)` — Processes a parameter as if it was in the queue, without ever passing to another thread.
- `T getSkipQueue(P parameter, C ... callbacks)` — Processes a parameter as if it was in the queue, without ever passing to another thread.
- `T getSkipQueue(P parameter, C callback)` — Processes a parameter as if it was in the queue, without ever passing to another thread.
- `T getSkipQueue(P parameter, java.lang.Iterable<C> callbacks)` — Processes a parameter as if it was in the queue, without ever passing to another thread.
- `void setActiveThreads(int coreSize)`