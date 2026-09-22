# AsynchronousExecutor.CallBackProvider

## Class signature

```java
public static interface AsynchronousExecutor.CallBackProvider<P, T, C, E extends java.lang.Throwable> extends java.util.concurrent.ThreadFactory
```

## Methods

- `T callStage1(P parameter)` — Normally an asynchronous call, but can be synchronous
- `void callStage2(P parameter, T object)` — Synchronous call
- `void callStage3(P parameter, T object, C callback)` — Synchronous call, called multiple times, once per registered callback