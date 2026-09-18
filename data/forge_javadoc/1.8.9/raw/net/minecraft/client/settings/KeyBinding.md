---
title: "KeyBinding"
description: "Returns true if the key is pressed (used for continuous querying)."
package: "net/minecraft/client/settings"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/settings/KeyBinding.html"
sourceType: javadoc
---

# KeyBinding

## Class signature

```java
public class KeyBinding extends java.lang.Object implements java.lang.Comparable< KeyBinding >
```

## Constructors

- `public KeyBinding(java.lang.String description, int keyCode, java.lang.String category)`

## Methods

- `public static void onTick(int keyCode)`
- `public static void setKeyBindState(int keyCode, boolean pressed)`
- `public static void unPressAllKeys()`
- `public static void resetKeyBindingArrayAndHash()`
- `public static java.util.Set<java.lang.String> getKeybinds()`
- `public boolean isKeyDown()`
- `public java.lang.String getKeyCategory()`
- `public boolean isPressed()`
- `public java.lang.String getKeyDescription()`
- `public int getKeyCodeDefault()`
- `public int getKeyCode()`
- `public void setKeyCode(int keyCode)`
- `public int compareTo( KeyBinding p_compareTo_1_)`

## Description

Returns true if the key is pressed (used for continuous querying).
