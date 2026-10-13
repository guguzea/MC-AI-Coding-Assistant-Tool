/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.runtime;

import com.google.common.base.Objects;

/**
 * Stores information about an SRG field mapping during AP runs
 */
public final class SrgField
{
    
    private final String mapping;
    
    public SrgField(String mapping)
    {
        this.mapping = mapping;
    }
    
    public String getName()
    {
        if (this.mapping == null)
        {
            return null;
        }
        int pos = this.mapping.lastIndexOf('/');
        return pos > -1 ? this.mapping.substring(pos + 1) : this.mapping;
    }
    
    public String getOwner()
    {
        if (this.mapping == null)
        {
            return null;
        }
        int pos = this.mapping.lastIndexOf('/');
        return pos > -1 ? this.mapping.substring(0, pos) : null;
    }
    
    public String getMapping()
    {
        return this.mapping;
    }
    
    public SrgField move(String newOwner)
    {
        return new SrgField((newOwner != null ? newOwner + "/" : "") + this.getName());
    }
    
    public SrgField copy()
    {
        return new SrgField(this.mapping);
    }
    
    @Override
    public int hashCode()
    {
        return Objects.hashCode(this.mapping);
    }
    
    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
        {
            return true;
        }
        if (obj instanceof SrgField)
        {
            return Objects.equal(this.mapping, ((SrgField)obj).mapping);
        }
        return false;
    }
    
    @Override
    public String toString()
    {
        return this.mapping;
    }
}
