# DisplayInfo

**Inheritance:** java.lang.Object → net.minecraft.advancements.DisplayInfo

## Class signature

```java
public class DisplayInfo extends java.lang.Object
```

## Constructors

- `DisplayInfo(ItemStack icon, ITextComponent title, ITextComponent description, ResourceLocation background, FrameType frame, boolean showToast, boolean announceToChat, boolean hidden)`

## Methods

- `static DisplayInfo deserialize(JsonObject object, JsonDeserializationContext context)`
- `ResourceLocation getBackground()`
- `ITextComponent getDescription()`
- `FrameType getFrame()`
- `ItemStack getIcon()`
- `ITextComponent getTitle()`
- `float getX()`
- `float getY()`
- `boolean isHidden()`
- `static DisplayInfo read(PacketBuffer buf)`
- `void setPosition(float x, float y)`
- `boolean shouldAnnounceToChat()`
- `boolean shouldShowToast()`
- `void write(PacketBuffer buf)`