# HoverEvent.Action

**Inheritance:** java.lang.Object → java.lang.Enum<HoverEvent.Action> → net.minecraft.event.HoverEvent.Action

## Class signature

```java
public static enum HoverEvent.Action extends java.lang.Enum<HoverEvent.Action>
```

## Methods

- `java.lang.String getCanonicalName()` — Gets the canonical name for this action (e.g., "show_achievement")
- `static HoverEvent.Action getValueByCanonicalName(java.lang.String canonicalNameIn)` — Gets a value by its canonical name.
- `boolean shouldAllowInChat()` — Indicates whether this event can be run from chat text.
- `static HoverEvent.Action valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static HoverEvent.Action [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.