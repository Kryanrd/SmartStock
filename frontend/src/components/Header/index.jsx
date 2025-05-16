import styled from 'styled-components';
import { FiMenu } from 'react-icons/fi';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background: #94E2FF;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 990;
  box-sizing: border-box; 

`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: #2d3436;
  margin-right: 1rem; 
`;

const Logo = styled.div`
  font-family: 'Tavolga-Free', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3436;
  flex: 1; 
  text-align: center; 
`;

const Login = styled.button`
  background: rgb(59, 121, 182);
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 4px;
  margin-left: auto; 
  white-space: nowrap; 
`;

const Header = ({ toggleSidebar }) => {
  return (
    <HeaderContainer>
      <MenuButton onClick={toggleSidebar}>
        <FiMenu />
      </MenuButton>

      <Logo>SmartStock-AI</Logo>

      <Login>LOGIN</Login>
    </HeaderContainer>
  );
};

export default Header;