/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.interfaces;

import java.util.Collection;
import java.util.Set;

public interface MixinContainer<L> extends Loadable<L>, Injectable
{
    
    /**
     * Get whether this container has any mixins
     */
    public abstract boolean hasMixins();

    /**
     * Get this mod's list of mixin configs
     */
    public abstract Set<String> getMixinConfigs();
    
    /**
     * Register a mixin error with the container
     * 
     * @param th caught throwable
     */
    public abstract void registerMixinError(Throwable th);
    
    /**
     * @return mixin errors
     */
    public abstract Collection<Throwable> getMixinErrors();

}
