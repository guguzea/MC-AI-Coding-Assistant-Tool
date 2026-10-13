/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.api;

/**
 * LiteLoader Extensible API - Post-render Observers
 * 
 * <p>PostRenderObservers receive the onPostRender event every frame, allowing
 * "draw-on-top" behaviour for API components.</p>
 * 
 * @author Adam Mummery-Smith
 */
public interface PostRenderObserver extends Observer
{
    public abstract void onPostRender(int mouseX, int mouseY, float partialTicks);
}
