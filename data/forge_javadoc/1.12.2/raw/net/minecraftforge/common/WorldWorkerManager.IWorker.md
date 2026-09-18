---
title: "WorldWorkerManager.IWorker"
description: "Perform a task, returning true from this will have the manager call this function again this tick if there is time left."
package: "net/minecraftforge/common"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/common/WorldWorkerManager.IWorker.html"
sourceType: javadoc
---

# WorldWorkerManager.IWorker

## Methods

- `boolean hasWork()`
- `default void work()`
- `default boolean doWork()`

## Description

Perform a task, returning true from this will have the manager call this function again this tick if there is time left.
