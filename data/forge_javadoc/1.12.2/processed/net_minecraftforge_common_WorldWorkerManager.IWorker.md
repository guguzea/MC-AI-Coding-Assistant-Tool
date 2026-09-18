# WorldWorkerManager.IWorker

## Methods

- `boolean hasWork()`
- `default void work()`
- `default boolean doWork()`

## Description

Perform a task, returning true from this will have the manager call this function again this tick if there is time left.