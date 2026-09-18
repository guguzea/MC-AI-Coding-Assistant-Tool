---
title: "IKeyConflictContext"
description: "Defines the context that a KeyBinding is used. Key conflicts occur when a KeyBinding has the same IKeyConflictContext and has conflicting modifiers and keyCodes."
package: "net/minecraftforge/client/settings"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/settings/IKeyConflictContext.html"
sourceType: javadoc
---

# IKeyConflictContext

## Class signature

```java
public interface IKeyConflictContext
```

## Methods

- `boolean isActive()`
- `boolean conflicts( IKeyConflictContext other)`

## Description

Defines the context that a KeyBinding is used. Key conflicts occur when a KeyBinding has the same IKeyConflictContext and has conflicting modifiers and keyCodes.
