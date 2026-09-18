---
title: "KeyModifier"
description: "Deprecated. use isActive(IKeyConflictContext)"
package: "net/minecraftforge/client/settings"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/client/settings/KeyModifier.html"
sourceType: javadoc
---

# KeyModifier

## Class signature

```java
public enum KeyModifier extends java.lang.Enum< KeyModifier >
```

## Methods

- `public static KeyModifier [] values()`
- `public static KeyModifier valueOf(java.lang.String name)`
- `public static KeyModifier getActiveModifier()`
- `public static boolean isKeyCodeModifier(int keyCode)`
- `public static KeyModifier valueFromString(java.lang.String stringValue)`
- `public abstract boolean matches(int keyCode)`
- `@Deprecated public abstract boolean isActive()`
- `public abstract boolean isActive(@Nullable IKeyConflictContext conflictContext)`
- `public abstract java.lang.String getLocalizedComboName(int keyCode)`

## Description

Deprecated. use isActive(IKeyConflictContext)
