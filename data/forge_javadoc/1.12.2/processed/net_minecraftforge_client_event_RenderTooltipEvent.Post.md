# RenderTooltipEvent.Post

## Constructors

- `public Post( ItemStack stack, java.util.List<java.lang.String> textLines, int x, int y, FontRenderer fr, int width, int height)`

## Methods

- `public int getWidth()`
- `public int getHeight()`

## Description

Events inheriting from this class are fired at different stages during the tooltip rendering. Do not use this event directly, use one of its subclasses: RenderTooltipEvent.PostBackground RenderTooltip