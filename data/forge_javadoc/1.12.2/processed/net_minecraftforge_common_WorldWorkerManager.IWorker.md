# WorldWorkerManager.IWorker

## Class signature

```java
public static interface WorldWorkerManager.IWorker
```

## Methods

- `default boolean doWork()` — Perform a task, returning true from this will have the manager call this function again this tick if there is time left.
- `boolean hasWork()`
- `default void work()`