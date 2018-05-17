
#ifndef _WXApiHandler_h
#define _WXApiHandler_h

#include <string>

class WXApiHandler  {
public:
    //是否安装了微信
    static bool IsWXAppInstalled();
    
    //分享屏幕截图
    static void SendScreenShot();
    
     //微信登录
    static void SendWechatAuth();
    
    
    static void SendAppContent(const std::string &roomPassword, const std::string &title,
                               const std::string &description, const std::string &shareLinkUrl);
    
    //微信分享链接(聊天界面）
    static void SendLinkURL(const std::string &url, const std::string &title, const std::string &content);
    
    //微信分享链接(朋友圈）
    static void ShareLinkTimeline(const std::string &url, const std::string &title, const std::string &content);
    
    
    //拉起微信支付
    static void JumpToWeixinPay(const std::string &partnerId, const std::string &prepayId, const std::string &nonceStr,
                                unsigned int &timeStamp, const std::string &package, const std::string &sign);
    
private:
    static void InnerSendLinkURL(const std::string &url, const std::string &title, const std::string &content, int targetScene);
};

#endif
