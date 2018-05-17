//
//  jsb_custom.hpp
//  hello_world-mobile
//
//  Created by zzz on 2018/4/25.
//

#ifndef jsb_custom_hpp
#define jsb_custom_hpp

#include <base/ccConfig.h>
#include <cocos/scripting/js-bindings/jswrapper/SeApi.h>

extern se::Object* __jsb_WXApiHandler_proto;
extern se::Class* __jsb_WXApiHandler_class;

bool register_all_custom_jsb(se::Object* obj);
SE_DECLARE_FUNC(js_custom_WXApiHandler_IsWeiXinAvilible);
#endif /* jsb_custom_hpp */
