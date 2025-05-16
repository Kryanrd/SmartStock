import styled from 'styled-components';
import { FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SidebarWrapper = styled.div`
  position: fixed;
  left: ${props => props.isOpen ? '0' : '-300px'};
  top: 0;
  height: 100vh;
  width: 250px;
  background: #ffffff;
  box-shadow: 2px 0 4px rgba(0,0,0,0.1);
  transition: left 0.3s ease-in-out;
  padding: 1rem;
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #666;
`;
const Linked = styled(Link)`
  text-decoration: none;
  color: #333;
`

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <SidebarWrapper isOpen={isOpen}>
      <CloseButton onClick={onClose}>
        <FiX />
      </CloseButton>
      <h3>Меню</h3>
      <Linked to="/warehouses">Склады</Linked>
      <p>Отчеты</p>
      <p>Настройки</p>
    </SidebarWrapper>
  );
};

export default Sidebar;