const tramsformJs = (code: string) => {
  return code
    // 替换 mybricks 为 @mybricks/ai-render
    .replace(/from\s+['"]mybricks['"]/g, "from '@mybricks/ai-render'")
    // 替换 less 为 module.less
    .replace(/(from\s+['"][^'"]+)\.less(['"]\s*)/g, '$1.module.less$2')
    // 替换 @PopupVisible 为空字符串
    .replace(/@PopupVisible/g, '');
}

const tramsformAppLess = (code: string) => {
  // 注入 reset.less
  return "@import './reset.less';\t\n" + code
}

/**
 * 暂时解决tabbar图片的报错问题
 * @param code 
 * @returns 
 */
const tramsformAppConfig = (code: string) => {
  return code.replace(
    /(\b(?:iconPath|selectedIconPath)\s*:\s*)(['"])(https?:\/\/[^'"]*)\2/g,
    '$1$2$2'
  )
}

export { tramsformJs, tramsformAppLess, tramsformAppConfig }
