import { Flex } from 'antd'
import React from 'react'
import XIcon from '../assets/x.svg'

const ProposedDate = ({ value, removeValue, index }) => {
  return (
    <Flex
      gap={'small'}
      style={{
        background: '#363636',
        color: '#fff',
        padding: '8px',
        borderRadius: '8px',
        width: 'fit-content'
      }}
    >
      {value}
      {removeValue && (
        <img
          src={XIcon}
          style={{
            cursor: 'pointer'
          }}
          onClick={() => removeValue(index)}
        />
      )}
    </Flex>
  )
}

export default ProposedDate