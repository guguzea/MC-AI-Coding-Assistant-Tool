# ClickEvent.Action

**Inheritance:** java.lang.Object → java.lang.Enum<ClickEvent.Action> → net.minecraft.event.ClickEvent.Action

## Class signature

```java
public static enum ClickEvent.Action extends java.lang.Enum<ClickEvent.Action>
```

## Methods

- `java.lang.String getCanonicalName()` — Gets the canonical name for this action (e.g., "run_command")
- `static ClickEvent.Action getValueByCanonicalName(java.lang.String canonicalNameIn)` — Gets a value by its canonical name.
- `boolean shouldAllowInChat()` — Indicates whether this event can be run from chat text.
- `static ClickEvent.Action valueOf(java.lang.String name)` — Returns the enum constant of this type with the specified name.
- `static ClickEvent.Action [] values()` — Returns an array containing the constants of this enum type, in the order they are declared.