---
title: "KeyBinding"
description: "Convenience constructor for creating KeyBindings with keyConflictContext set."
package: "net/minecraftforge/client/settings"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraft/client/settings/KeyBinding.html"
sourceType: javadoc
---

# KeyBinding

## Class signature

```java
public class KeyBinding extends java.lang.Object implements java.lang.Comparable< KeyBinding >
```

## Constructors

- `public KeyBinding(java.lang.String description, int keyCode, java.lang.String category)`
- `public KeyBinding(java.lang.String description, IKeyConflictContext keyConflictContext, int keyCode, java.lang.String category)`
- `public KeyBinding(java.lang.String description, IKeyConflictContext keyConflictContext, KeyModifier keyModifier, int keyCode, java.lang.String category)`

## Methods

- `public static void onTick(int keyCode)`
- `public static void setKeyBindState(int keyCode, boolean pressed)`
- `public static void updateKeyBindState()`
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
- `public boolean isActiveAndMatches(int keyCode)`
- `public void setKeyConflictContext( IKeyConflictContext keyConflictContext)`
- `public IKeyConflictContext getKeyConflictContext()`
- `public KeyModifier getKeyModifierDefault()`
- `public KeyModifier getKeyModifier()`
- `public void setKeyModifierAndCode( KeyModifier keyModifier, int keyCode)`
- `public void setToDefault()`
- `public boolean isSetToDefaultValue()`
- `public boolean conflicts( KeyBinding other)`
- `public boolean hasKeyCodeModifierConflict( KeyBinding other)`
- `public java.lang.String getDisplayName()`

## Description

Convenience constructor for creating KeyBindings with keyConflictContext set.
