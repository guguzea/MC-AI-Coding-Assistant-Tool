---
title: "KeyModifier"
description: "public enum KeyModifier extends java.lang.Enum<KeyModifier>"
package: "net/minecraftforge/client/settings"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/client/settings/KeyModifier.html"
sourceType: javadoc
---

# KeyModifier

**Inheritance:** java.lang.Object → java.lang.Enum<KeyModifier> → net.minecraftforge.client.settings.KeyModifier

## Class signature

```java
public enum KeyModifier extends java.lang.Enum<KeyModifier>
```

## Methods

- `static KeyModifier getActiveModifier()`
- `abstract java.lang.String getLocalizedComboName(int keyCode)`
- `@Deprecated abstract boolean isActive()` — Deprecated. use isActive(IKeyConflictContext)
- `abstract boolean isActive(IKeyConflictContext conflictContext)`
- `static boolean isKeyCodeModifier(int keyCode)`
- `abstract boolean matches(int keyCode)`
- `static KeyModifier valueFromString(java.lang.String stringValue)`
- `static KeyModifier valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static KeyModifier [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.

## Fields

- `static KeyModifier [] MODIFIER_VALUES`
