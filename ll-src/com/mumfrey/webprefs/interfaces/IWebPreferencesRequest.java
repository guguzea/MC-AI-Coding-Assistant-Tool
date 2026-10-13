package com.mumfrey.webprefs.interfaces;

import java.io.Serializable;
import java.net.URI;
import java.util.Map;
import java.util.Set;

public interface IWebPreferencesRequest extends Serializable
{
    public abstract IWebPreferencesServiceDelegate getDelegate();
    
    public abstract boolean isValidationRequired();
    
    public abstract URI getRequestURI();

    public abstract String getUUID();

    public abstract Set<String> getKeys();
    
    public abstract Map<String, String> getPostVars();

    public abstract void onReceivedResponse(IWebPreferencesResponse response);
}
