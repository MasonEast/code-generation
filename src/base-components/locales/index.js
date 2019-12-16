/*
 * @Author: chenshizhong
 * @Date: 2019/9/16 16:30:14
 * @Description:国际化组件
 */
import React from 'react';
import {ConfigProvider} from 'antd';
import {IntlProvider} from 'react-intl'; // 业务文本国际化切换 目前使用react-intl （阿里也提供了react-intl-universal）
import {getCookie} from '../../utils';

import commonZh from '../../locales/zh_CN'; // 引入通用中文语言包
import commonEn from '../../locales/en_US'; // 引入通用英文语言包

import antd_zh_CN from 'antd/lib/locale-provider/zh_CN';     // antd组件中文包
import antd_en_US from 'antd/lib/locale-provider/en_US';     // antd组件英文包

const antd_langMap = {
    'zh':antd_zh_CN,
    'en':antd_en_US,
}
// 获取本地cookie存储的语言
const currentLang = getCookie('ERPLanguage') || 'zh';

const Locales = ({children, langMap, useCommonLang}) => {
    // 如需使用通用语言包 合并通用语言包
    if(useCommonLang){
        Object.assign(langMap['zh'],commonZh);
        Object.assign(langMap['en'],commonEn);
    }

    document.title = langMap[currentLang]['html.title'] || '管易C-ERP电子商务管理软件';
    return (
        <IntlProvider
            locale={navigator.language || 'zh'}
            messages={langMap[currentLang]}
        >
            <ConfigProvider locale={antd_langMap[currentLang]}>
                {children}
            </ConfigProvider>
        </IntlProvider>
    )
}
export default Locales;