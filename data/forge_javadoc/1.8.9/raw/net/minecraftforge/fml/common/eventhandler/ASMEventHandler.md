---
title: "ASMEventHandler"
description: "public class ASMEventHandler extends java.lang.Object implements IEventListener"
package: "net/minecraftforge/fml/common/eventhandler"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/fml/common/eventhandler/ASMEventHandler.html"
sourceType: javadoc
---

# ASMEventHandler

**Inheritance:** java.lang.Object → net.minecraftforge.fml.common.eventhandler.ASMEventHandler

## Class signature

```java
public class ASMEventHandler extends java.lang.Object implements IEventListener
```

## Constructors

- `ASMEventHandler(java.lang.Object target, java.lang.reflect.Method method, ModContainer owner)`

## Methods

- `java.lang.Class<?> createWrapper(java.lang.reflect.Method callback)`
- `EventPriority getPriority()`
- `void invoke(Event event)`
- `java.lang.String toString()`
