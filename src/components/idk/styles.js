import styled from "styled-components";

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-right: 25px;
  :hover{
    cursor: pointer;
    opacity: 50%
    
  }
  @media(max-width: 1000px) {
    width: 100%;
  }
  @media(max-width: 767px) {
    width: 100%;
  }
`;