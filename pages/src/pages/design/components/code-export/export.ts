import JSZip from 'jszip';

/**
 * 代码结构生成器
 * 负责将组件数据按照代码结构生成并组织文件
 */
export interface FileItem {
  /** 文件名（包含相对路径，如 runtime.jsx） */
  fileName: string;
  /** 文件内容 */
  content: string | Blob;
}

export interface ExportProgress {
  /** 当前进度（0-100） */
  progress: number;
  /** 当前处理的文件 */
  currentFile?: string;
  /** 总文件数 */
  totalFiles: number;
  /** 已完成文件数 */
  completedFiles: number;
}

export interface ExportOptions {
  /** 文件夹名称 */
  folderName?: string;
  /** 进度回调 */
  onProgress?: (progress: ExportProgress) => void;
}

export type ExportMode = 'directory' | 'zip';

export async function exportCode(
  files: FileItem[],
  options: ExportOptions = {}
) {
  const mode = getExportMode();

  if (mode === 'directory') {
    return exportToDirectory(files, options);
  }

  return exportToZip(files, options);
}

async function exportToDirectory(
  files: FileItem[],
  options: ExportOptions = {}
) {
  const { folderName = 'App', onProgress } = options;

  // 使用浏览器文件系统 API 导出
  console.log('[代码导出] 使用浏览器文件系统 API');

  try {
    // 1. 请求用户选择目录
    const directoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite',
      startIn: 'downloads',
    });

    // 2. 创建组件文件夹
    const componentDirHandle = await directoryHandle.getDirectoryHandle(folderName, {
      create: true,
    });

    // 3. 写入文件
    const totalFiles = files.length;
    let completedFiles = 0;

    for (const file of files) {
      await writeFile(componentDirHandle, file);
      completedFiles++;

      onProgress?.({
        progress: Math.round((completedFiles / totalFiles) * 100),
        currentFile: file.fileName,
        totalFiles,
        completedFiles,
      });
    }

    console.log(`[浏览器导出] 成功导出 ${totalFiles} 个文件到: ${folderName}`);
  } catch (error) {
    if ((error as any).name === 'AbortError') {
      console.log('[浏览器导出] 用户取消导出');
      throw new Error('用户取消导出');
    }
    throw error;
  }
}

async function exportToZip(
  files: FileItem[],
  options: ExportOptions = {}
) {
  const { folderName = 'App', onProgress } = options;
  const zip = new JSZip();
  const totalFiles = files.length;
  let completedFiles = 0;

  for (const file of files) {
    zip.file(`${folderName}/${file.fileName}`, file.content);
    completedFiles++;

    onProgress?.({
      progress: Math.round((completedFiles / totalFiles) * 100),
      currentFile: file.fileName,
      totalFiles,
      completedFiles,
    });
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log(`[浏览器导出] 已下载 zip 包: ${folderName}.zip`);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * 写入单个文件（支持嵌套目录）
 */
async function writeFile(
  rootDirHandle: FileSystemDirectoryHandle,
  file: FileItem
): Promise<void> {
  const pathParts = file.fileName.split('/').filter(Boolean);
  const fileName = pathParts.pop();

  if (!fileName) {
    throw new Error(`无效的文件路径: ${file.fileName}`);
  }

  // 创建嵌套目录
  let currentDirHandle = rootDirHandle;
  for (const dirName of pathParts) {
    currentDirHandle = await currentDirHandle.getDirectoryHandle(dirName, {
      create: true,
    });
  }

  // 创建文件
  const fileHandle = await currentDirHandle.getFileHandle(fileName, {
    create: true,
  });

  // 写入内容
  const writable = await fileHandle.createWritable();
  await writable.write(file.content);
  await writable.close();
}

function getExportMode(): ExportMode {
  if (window.isSecureContext && typeof window.showDirectoryPicker === 'function') {
    return 'directory';
  }

  return 'zip';
}
