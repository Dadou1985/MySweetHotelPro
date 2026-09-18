import React from 'react'
import { Form, FloatingLabel } from 'react-bootstrap';

const TextareaElement = ({containerStyle = {margin: "0"}, label, row, value, name, handleChange, setFormValue, size}) => {
  return (
    <div style={containerStyle}>
        <Form.Group controlId="details">
            <FloatingLabel
                controlId="floatingInput"
                label={label}
                className="mb-3"
            >
                <Form.Control 
                    as="textarea" 
                    rows={row} 
                    value={value} 
                    name={name} 
                    onChange={(event) => handleChange(event, setFormValue)}
                    style={size}   
                />
            </FloatingLabel>
        </Form.Group>
    </div>
  )
}

export default TextareaElement