//
//  jsb_custom.cpp
//  hello_world-mobile
//
//  Created by zzz on 2018/4/25.
//

#include "jsb_custom.hpp"

#include <scripting/js-bindings/manual/jsb_cocos2dx_manual.hpp>
#include <scripting/js-bindings/manual/jsb_conversions.hpp>
#include <scripting/js-bindings/manual/jsb_global.h>
#include <scripting/js-bindings/manual/BaseJSAction.h>
#include <scripting/js-bindings/jswrapper/SeApi.h>

#include "WXApiHandler.h"
#include <cocos2d.h>

USING_NS_CC;

se::Object* __jsb_WXApiHandler_proto = nullptr;
se::Class* __jsb_WXApiHandler_class = nullptr;

static bool js_custom_WXApiHandler_IsWeiXinAvilible(se::State& s){
    const auto& args = s.args();
    size_t argc = args.size();
    CC_UNUSED bool ok = true;
    if (argc == 0) {
        log("js_custom_WXApiHandler_IsWeiXinAvilible");
        //bool ret = WXApiHandler::IsWXAppInstalled();
        
        // ok = boolean_to_seval(ret, &s.rval());
        return true;
    }
    SE_PRECONDITION2(ok, false, "js_custom_WXApiHandler_isWeiXinAvilible wrong number of argument");
    return false;
}
SE_BIND_FUNC(js_custom_WXApiHandler_IsWeiXinAvilible)


bool js_register_custom_WXApiHandler(se::Object* obj) {
    auto cls = se::Class::create("WXApiHandler", obj, __jsb_WXApiHandler_proto, nullptr);
    
    cls->defineStaticFunction("IsWeiXinAvilible", _SE(js_custom_WXApiHandler_IsWeiXinAvilible));
    
    cls->install();
    JSBClassType::registerClass<WXApiHandler>(cls);
    
    __jsb_WXApiHandler_proto = cls->getProto();
    __jsb_WXApiHandler_class = cls;
    jsb_set_extend_property("BB", "WXApiHandler");
    se::ScriptEngine::getInstance()->clearException();
    return true;
}

bool register_all_custom_jsb(se::Object* obj) {
    se::Value nsVal;
    if (!obj->getProperty("BB", &nsVal))
    {
        se::HandleObject jsobj(se::Object::createPlainObject());
        nsVal.setObject(jsobj);
        obj->setProperty("BB", nsVal);
    }
    se::Object* ns = nsVal.toObject();
    
    js_register_custom_WXApiHandler(ns);
    return true;
}
