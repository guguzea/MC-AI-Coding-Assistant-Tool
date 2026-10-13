package com.mumfrey.webprefs.framework;

import com.mumfrey.webprefs.interfaces.IWebPreferencesClient;
import com.mumfrey.webprefs.interfaces.IWebPreferencesProvider;
import com.mumfrey.webprefs.interfaces.IWebPreferencesRequest;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;

class WebPreferencesServiceTaskGet extends WebPreferencesServiceTask
{
    WebPreferencesServiceTaskGet(IWebPreferencesProvider provider, IWebPreferencesClient client)
    {
        super(provider, client);
    }
    
    @Override
    public void onReceivedResponse(IWebPreferencesRequest request, IWebPreferencesResponse response)
    {
        IWebPreferencesClient client = this.getClient();
        if (client != null && response.hasValues())
        {
            client.onGetRequestSuccess(response.getUUID(), response.getValues());
        }
    }

    @Override
    public void onRequestFailed(IWebPreferencesRequest request, Throwable th, RequestFailureReason reason)
    {
        IWebPreferencesClient client = this.getClient();
        if (client != null)
        {
            client.onGetRequestFailed(request.getUUID(), request.getKeys(), reason);
        }
    }
}
