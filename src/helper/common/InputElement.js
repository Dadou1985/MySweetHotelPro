import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';


const InputElement = ({containerStyle = {margin: "10vh"}, label, placeholder, size, value, name, handleChange, setFormValue}) => {
    return (
    <div style={containerStyle}>
        <Form.Group controlId="description">
            <FloatingLabel
                controlId="floatingInput"
                label={label}
                className="mb-3"
            >
                <Form.Control type="text" placeholder={placeholder} style={{ width: size }} value={value} name={name} onChange={(event) => handleChange(event, setFormValue)} />
            </FloatingLabel>
        </Form.Group>
    </div>)
};

export default InputElement