---
title: "KeyBinding"
description: "public class KeyBinding extends java.lang.Object implements java.lang.Comparable<KeyBinding>"
package: "net/minecraft/client/settings"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/settings/KeyBinding.html"
sourceType: javadoc
---

# KeyBinding

**Inheritance:** java.lang.Object → net.minecraft.client.settings.KeyBinding

## Class signature

```java
public class KeyBinding extends java.lang.Object implements java.lang.Comparable<KeyBinding>
```

## Constructors

- `KeyBinding(java.lang.String description, int keyCode, java.lang.String category)`

## Methods

- `int compareTo(KeyBinding p_compareTo_1_)`
- `static java.util.Set<java.lang.String> getKeybinds()`
- `java.lang.String getKeyCategory()`
- `int getKeyCode()`
- `int getKeyCodeDefault()`
- `java.lang.String getKeyDescription()`
- `boolean isKeyDown()` — Returns true if the key is pressed (used for continuous querying).
- `boolean isPressed()` — Returns true on the initial key press.
- `static void onTick(int keyCode)`
- `static void resetKeyBindingArrayAndHash()`
- `static void setKeyBindState(int keyCode, boolean pressed)`
- `void setKeyCode(int keyCode)`
- `static void unPressAllKeys()`
