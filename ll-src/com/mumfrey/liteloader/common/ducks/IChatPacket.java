/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.common.ducks;

import net.minecraft.util.text.ITextComponent;

public interface IChatPacket
{
    public abstract ITextComponent getChatComponent();

    public abstract void setChatComponent(ITextComponent chatComponent);
}
