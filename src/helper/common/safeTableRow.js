import React from 'react'

const SafeTableRow = ({rowId, cellLabelValue, cellInputId, cellOutputId, safeTotal, safeAmount, labelValue}) => {
    const change = (a, b, c) => {
        let x = document.getElementById(a).value * b
        const outputValue = document.getElementById(c).value = x.toFixed(2)
        return outputValue
    }

  return (
    <tr key={rowId.toString()}>
        <td>{cellLabelValue}</td>
        <td>
          <input id={cellInputId} 
            type="text" 
            onInput={()=> change(cellInputId, labelValue, cellOutputId)} 
            onInputCapture={()=>safeTotal()} 
            onChange={()=>safeAmount()}>
          </input>
        </td>
        <td><output id={cellOutputId}>0.00</output></td>
    </tr>
  )
}

export default SafeTableRow