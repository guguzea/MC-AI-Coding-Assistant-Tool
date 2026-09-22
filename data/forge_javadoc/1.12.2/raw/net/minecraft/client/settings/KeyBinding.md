---
title: "KeyBinding"
description: "public class KeyBinding extends java.lang.Object implements java.lang.Comparable<KeyBinding>"
package: "net/minecraft/client/settings"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/client/settings/KeyBinding.html"
sourceType: javadoc
---

# KeyBinding

**Inheritance:** java.lang.Object → net.minecraft.client.settings.KeyBinding

## Class signature

```java
public class KeyBinding extends java.lang.Object implements java.lang.Comparable<KeyBinding>
```

## Constructors

- `KeyBinding(java.lang.String description, IKeyConflictContext keyConflictContext, int keyCode, java.lang.String category)`
- `KeyBinding(java.lang.String description, IKeyConflictContext keyConflictContext, KeyModifier keyModifier, int keyCode, java.lang.String category)`
- `KeyBinding(java.lang.String description, int keyCode, java.lang.String category)`

## Methods

- `int compareTo(KeyBinding p_compareTo_1_)`
- `boolean conflicts(KeyBinding other)` — Returns true when the other keyBinding conflicts with this one
- `java.lang.String getDisplayName()`
- `static java.util.function.Supplier<java.lang.String> getDisplayString(java.lang.String key)` — Forge End
- `static java.util.Set<java.lang.String> getKeybinds()`
- `java.lang.String getKeyCategory()`
- `int getKeyCode()`
- `int getKeyCodeDefault()`
- `IKeyConflictContext getKeyConflictContext()`
- `java.lang.String getKeyDescription()`
- `KeyModifier getKeyModifier()`
- `KeyModifier getKeyModifierDefault()`
- `boolean hasKeyCodeModifierConflict(KeyBinding other)` — Returns true when one of the bindings' key codes conflicts with the other's modifier.
- `boolean isActiveAndMatches(int keyCode)` — Checks that the key conflict context and modifier are active, and that the keyCode matches this binding.
- `boolean isKeyDown()`
- `boolean isPressed()`
- `boolean isSetToDefaultValue()`
- `static void onTick(int keyCode)`
- `static void resetKeyBindingArrayAndHash()`
- `static void setKeyBindState(int keyCode, boolean pressed)`
- `void setKeyCode(int keyCode)`
- `void setKeyConflictContext(IKeyConflictContext keyConflictContext)`
- `void setKeyModifierAndCode(KeyModifier keyModifier, int keyCode)`
- `void setToDefault()`
- `static void unPressAllKeys()`
- `static void updateKeyBindState()`
