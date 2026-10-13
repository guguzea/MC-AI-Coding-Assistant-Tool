/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.ducks;

public interface IFramebuffer
{
    public abstract IFramebuffer setDispatchRenderEvent(boolean dispatchRenderEvent);

    public abstract boolean isDispatchRenderEvent();
}
