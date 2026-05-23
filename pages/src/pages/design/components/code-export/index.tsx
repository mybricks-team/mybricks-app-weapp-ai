import React from 'react'
import { Button } from 'antd'
import type { ExportJSON } from './exportHelper'
import { useAiSourceCodeExport } from './useExport'

interface CodeExportButtonProps {
  disabled?: boolean
  getExportToJSON: () => ExportJSON
}

export default function CodeExportButton({ disabled = false, getExportToJSON }: CodeExportButtonProps) {
  const { loading, handleExport } = useAiSourceCodeExport({
    getExportToJSON,
    folderName: 'App',
  })

  return (
    <Button onClick={handleExport} loading={loading} disabled={disabled}>
      导出
    </Button>
  )
}
