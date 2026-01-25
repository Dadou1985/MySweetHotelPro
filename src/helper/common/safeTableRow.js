import React, { useMemo } from "react"

const SafeTableRow = ({ rowId, label, value, inputId, outputId, qty, onQtyChange }) => {
  const amount = useMemo(() => {
    const n = Number(qty)
    if (Number.isNaN(n)) return 0
    return n * Number(value)
  }, [qty, value])

  return (
    <tr key={rowId.toString()}>
      <td>{label}</td>
      <td>
        <input
          id={inputId}
          type="number"
          min={0}
          step={1}
          value={qty}
          onChange={(e) => onQtyChange(inputId, e.target.value)}
        />
      </td>
      <td>
        <output id={outputId}>{amount.toFixed(2)}</output>
      </td>
    </tr>
  )
}

export default SafeTableRow