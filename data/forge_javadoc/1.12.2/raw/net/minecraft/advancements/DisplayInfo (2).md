---
title: "DisplayInfo"
description: "public class DisplayInfo extends java.lang.Object"
package: "net/minecraft/advancements"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/advancements/DisplayInfo.html"
sourceType: javadoc
---

# DisplayInfo

## Class signature

```java
public class DisplayInfo extends java.lang.Object
```

## Constructors

- `public DisplayInfo( ItemStack icon, ITextComponent title, ITextComponent description, ResourceLocation background, FrameType frame, boolean showToast, boolean announceToChat, boolean hidden)`

## Methods

- `public void setPosition(float x, float y)`
- `public ITextComponent getTitle()`
- `public ITextComponent getDescription()`
- `public ItemStack getIcon()`
- `public ResourceLocation getBackground()`
- `public FrameType getFrame()`
- `public float getX()`
- `public float getY()`
- `public boolean shouldShowToast()`
- `public boolean shouldAnnounceToChat()`
- `public boolean isHidden()`
- `public static DisplayInfo deserialize(JsonObject object, JsonDeserializationContext context)`
- `public void write( PacketBuffer buf)`
- `public static DisplayInfo read( PacketBuffer buf) throws java.io.IOException`
