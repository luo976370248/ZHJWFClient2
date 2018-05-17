#include "WXApiHandler.h"
#import "WXApi.h"

// 判断是否安装了微信
bool WXApiHandler::IsWXAppInstalled() {
    return [WXApi isWXAppInstalled];
}

void WXApiHandler::SendWechatAuth() {
    SendAuthReq* req = [[[SendAuthReq alloc]init] autorelease];
    req.scope = @"snsapi_message,snsapi_userinfo,snsapi_friend,snsapi_contact";
    req.state = @"";
    [WXApi sendReq:req];
}
