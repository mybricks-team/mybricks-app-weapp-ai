import React from 'react'
import * as Taro from '@tarojs/taro'
import { LeftOutlined } from '@ant-design/icons'

const ActionBar = () => {
  return (
    <div
      style={{
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 999,
      transform: 'translateX(calc(-100% - 8px))'
    }}>
      <div
        style={{
          width: 32,
          height: 32,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onClick={() => {
          Taro.navigateBack()
        }}
      >
        <LeftOutlined style={{ fontSize: 14, color: '#fff' }} />
      </div>
    </div>
  )
}

export { ActionBar }
