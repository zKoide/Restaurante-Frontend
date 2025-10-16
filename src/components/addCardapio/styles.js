import styled from "styled-components";

export const Form = styled.form`

  width: 900px;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 200px;
    margin: 0px 0 0px;
  
  }
  p {
    color: #ff3333;
    margin-bottom: 15px;
    border: 1px solid #ff3333;
    padding: 10px;
    width: 100%;
    text-align: center;
  }
  input {
    border-radius: 5px;
    flex: 1;
    height: 46px;
    margin-bottom: 15px;
    padding: 12px 20px;
    color: #777;
    font-size: 15px;
    width: 100%;
    border: 1px solid #ddd;
    &::placeholder {
      color: #999;
    }
  }
  button {
    color: #fff;
    font-size: 16px;
    background: #fc6963;
    height: 56px;
    border: 0;
    border-radius: 5px;
    width: 100%;
  }
  hr {
    margin: 20px 0;
    border: none;
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
  }
  a {
    font-size: 16;
    font-weight: bold;
    color: #999;
    text-decoration: none;
  }
  .close {
    
  }
`;
export const Overlay = styled.div`
    background: rgba(242, 243, 245, 0.8);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;
    align-items: center; 
    z-index: 1000;
    overflow-y: auto; /* permite scroll vertical se o popup for maior que a tela */
    padding: 20px;   
`;
/*export const Container = styled.div`

    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100%;
    height: 100%;
    padding: 2rem 3rem;
    border-radius: 5px;
    box-shadow: 0 0 60px rgba(0,0,0, 0.05);
    text-align: center;
    align-content: center;

    max-height: 90vh; 
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
`;*/

export const Container = styled.div`
    position: relative;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 60px rgba(0,0,0, 0.05);
    width: 694px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    overflow: hidden; /* evita conteúdo quebrando o container */



    .popup-body {
        flex: 1 1 auto; /* ocupa o restante */
        overflow-y: auto; /* scroll interno */
        padding: 1rem 2rem;

        /* Scroll invisível */
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
    .popup-body::-webkit-scrollbar {
        display: none;
    }
`;

export const Close = styled.div`
    background: transparent;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #777;
    transition: color 0.2s ease;
    line-height: 1;

    display: flex;
    align-items: ;
    justify-content: center;
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 1000;
    img{
      width: 24px;
    }
`;
