#ifndef _WXImageDownloader_h
#define _WXImageDownloader_h

#include "cocos2d.h"
#include "HttpRequest.h"
#include "renderer/CCTexture2D.h"
#include "network/HttpClient.h"

using namespace std;
using namespace cocos2d;

class TWexinInfo {
public:
    
};

class  WXImageDownloader : public Ref {
public:
    WXImageDownloader():m_weixinInfo(NULL), m_bRetainInfo(false) {};
    ~WXImageDownloader() {
        if( !m_bRetainInfo )
            CC_SAFE_DELETE( m_weixinInfo );
    };
    
    static WXImageDownloader* Create() {
        WXImageDownloader* dl = new WXImageDownloader();
        //        dl->autorelease();
        return dl;
    }
    
    //    Texture2D* GetHeadFromCache(<#const std::string &openId#>);
    
    //下载指定人（openId)的头像
    static void Download(const string& openId, const string& headUrl) {
        WXImageDownloader* dl = new WXImageDownloader();
        dl->m_weixinInfo = new TWexinInfo();
        dl->m_weixinInfo->openId = openId;
        dl->m_weixinInfo->headUrl = headUrl;
        dl->Download();
    }
    
    void setWexinInfo(TWexinInfo * info) {
        m_weixinInfo = info;
    };
    
    void Download();
    void Download(TWexinInfo * info);
    void DownloadUrl(const char* url, const char* filename);
    
    void GetUrl(const char* url, cocos2d::network::ccHttpRequestCallback completeCallback);
    
    void GetAccessToken(const std::string &code);
    void GetHeadImg(const std::string &access_token, const std::string &openId);
    
    
    void SetRetain(bool retain) {
        m_bRetainInfo = retain;
    }
    
    std::string m_fileName;
    TWexinInfo* m_weixinInfo;
    
private:
    void GetOpenidComplete(cocos2d::network::HttpClient *sender, cocos2d::network::HttpResponse *response);
    void GetHeadurlComplete(cocos2d::network::HttpClient *sender, cocos2d::network::HttpResponse *response);
    void HeadImgDownloadComplete(cocos2d::network::HttpClient *sender, cocos2d::network::HttpResponse *response);
    
    
    bool        m_bRetainInfo;
};

#endif
