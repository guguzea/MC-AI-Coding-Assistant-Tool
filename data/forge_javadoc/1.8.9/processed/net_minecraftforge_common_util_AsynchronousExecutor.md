# AsynchronousExecutor

## Class signature

```java
public final class AsynchronousExecutor<P,T,C,E extends java.lang.Throwable> extends java.lang.Object
```

## Constructors

- `public AsynchronousExecutor( AsynchronousExecutor.CallBackProvider < P , T , C , E > provider, int coreSize)`

## Methods

- `public void add( P parameter, C callback)`
- `public boolean drop( P parameter, C callback) throws java.lang.IllegalStateException`
- `public T get( P parameter) throws E extends java.lang.Throwable, java.lang.IllegalStateException`
- `public T getSkipQueue( P parameter) throws E extends java.lang.Throwable`
- `public T getSkipQueue( P parameter, C callback) throws E extends java.lang.Throwable`
- `public T getSkipQueue( P parameter, C ... callbacks) throws E extends java.lang.Throwable`
- `public T getSkipQueue( P parameter, java.lang.Iterable< C > callbacks) throws E extends java.lang.Throwable`
- `public void finishActive() throws E extends java.lang.Throwable`
- `public void setActiveThreads(int coreSize)`

## Description

Executes tasks using a multi-stage process executor. Synchronous executions are via finishActive() or the get(Object) methods. Stage 1 creates the object from a parameter, and is usually called asynch