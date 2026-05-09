const tramsformJs = (code: string) => {
  let resultCode = '';
  let hasDataSource = false;

  const nextCode = code
    // 去除 mybricks 的 DataSource，其余内容仍替换为 @mybricks/ai-render
    .replace(/import\s*\{([\s\S]*?)\}\s*from\s*['"]mybricks['"]\s*;?/g, (_, imports: string) => {
      const nextImports = imports
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
        .filter((item) => {
          const importName = item.split(/\s+as\s+/)[0].trim();
          if (importName === 'DataSource') {
            hasDataSource = true;
            return false;
          }
          return true;
        });

      if (!nextImports.length) {
        return '';
      }

      return `import { ${nextImports.join(', ')} } from '@mybricks/ai-render'\n`;
    })
    // 替换 less 为 module.less
    .replace(/(from\s+['"][^'"]+)\.less(['"]\s*)/g, '$1.module.less$2')
    // 替换 @PopupVisible 为空字符串
    .replace(/@PopupVisible/g, '');

  if (hasDataSource) {
    resultCode += `import DataSource from './utils/DataSource'\n`;
  }

  resultCode += nextCode;

  return resultCode;
}

const tramsformAppJs = (code: string) => {
  // 注入 reset.less
  return insertImportAfterLastImport(code, "import './reset.less'")
}

function insertImportAfterLastImport(code: string, newImport: string) {
  const lines = code.split('\n');
  console.log('=====',code,lines)
  let lastImportIndex = -1;
  // 从后向前找最后一个以 'import ' 开头的行
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
      break;
    }
  }
  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, newImport);
  }
  return lines.join('\n');
}

export { tramsformJs, tramsformAppJs }
