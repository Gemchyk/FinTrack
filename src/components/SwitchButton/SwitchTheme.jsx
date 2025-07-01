import React from 'react';
import styled from 'styled-components';

const SwitchTheme = ({ checked, onChange }) => {
  return (
    <StyledWrapper>
      <div className="toggle-switch">
        <label className="switch-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={checked}
            onChange={onChange}
          />
          <span className="slider" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggle-switch {
    position: relative;
    width: 40px;
    height: 20px;
    --light: #d8dbe0;
    --dark: #28292c;
  }

  .switch-label {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--dark);
    border-radius: 20px;
    cursor: pointer;
    border: 2px solid var(--dark);
  }

  .checkbox {
    display: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider {
    background-color: var(--light);
  }

  .slider::before {
    content: "";
    position: absolute;
    top: 0px;
    left: 0px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: var(--light);
    transition: 0.3s;
    box-shadow: 5px 2px 7px rgba(8, 8, 8, 0.308);
  }

  .checkbox:checked ~ .slider::before {
    transform: translateX(20px);
    background-color: var(--dark);
    box-shadow: none;
  }
`;

export default SwitchTheme;
