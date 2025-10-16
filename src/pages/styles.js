import styled from "styled-components";

export const Container = styled.div`
  justify-content: center;
  flex-direction: column;
  @media(max-width: 767px) {
    left:0vw;
  }
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 70%;
  @media(max-width: 1000px) {
    width: 100%;
  }
  @media(max-width: 767px) {
    width: 100%;
  }
`;
export const Header = styled.div`
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content:center;
  @media(max-width: 767px) {
    left:0vw;
  }
`;
export const Title = styled.h1`
  font-size:30px;
  color: var(--black);
`;
export const Text = styled.span`
  padding-top:15px;
  color: var(--black);
  font-size:18px;
  :last-child{
    padding-top: 0px;
  }
  :frist-child{
    padding-top: 0px;
  }
`;
export const Span = styled.span`
  padding-top:15px;
  color: var(--black);
  font-size:14px;
  :last-child{
    padding-bottom: 15px;
  }
  :frist-child{
    padding-top: 0px;
  }
`;
export const Button = styled.button`
  color: #fff;
  font-size: 16px;
  background: #fc6963;
  height: 46px;
  padding: 12px 20px;
  border: 0;
  border-radius: 5px;
  width: 100px;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  :hover{
    cursor: pointer;
  }
  @media(max-width: 767px) {
    width: 16%;
    font-size: 15px;
  padding: 12px 1px;
  }
`;
export const Input = styled.input`
  box-sizing: border-box;
  flex: 1;
  height: 46px;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-right: 15px;
  padding: 12px 20px;
  color: #777;
  font-size: 15px;
  width: 70%;
  border: 1px solid #ddd;
  :last-child{
    margin-right:0px;
  }
  &::placeholder {
    color: #999;
  }
  @media(max-width: 1000px) {
    width: 100%;
  }
  @media(max-width: 767px) {
    width: 100%;
  }
`;
export const Input2 = styled.input`
  box-sizing: border-box;
  flex: 1;
  height: 46px;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-right: 15px;
  padding: 12px 20px;
  color: #777;
  font-size: 15px;
  width: 50%;
  border: 1px solid #ddd;
  :last-child{
    margin-right:0px;
  }
  &::placeholder {
    color: #999;
  }
  @media(max-width: 767px) {
    width: 100%;
  }
`;