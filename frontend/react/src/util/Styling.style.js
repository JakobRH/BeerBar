import styled from 'styled-components';
import {Card, Input, Layout, Menu, Select} from 'antd';
import {ToastContainer} from 'react-toastify';

const {Content, Footer} = Layout;

export const PageContainer = styled.div`
    height: 100%;
    margin-left: 156px;
    ::-webkit-scrollbar{width: 3px;}
    ::-webkit-scrollbar-track {border-radius: 4px; background: 	lightgray;}
    ::-webkit-scrollbar-thumb {border-radius: 4px; background: red;}
`;

export const StyledMenu = styled(Menu)`
    margin: auto;
    min-width: 350px;
`;

export const StyledContent = styled(Content)`
    height: 100%;
    overflow: auto;
    padding: 1rem 12.5%;
    
    @media (max-width: 950px){
        padding: 1rem 1rem;
    }
`;

export const StyledFooter = styled(Footer)`
    position: sticky;
    z-index: 10;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0A2641;
    color: white;
`;


export const StyledSelect = styled(Select)`
    width: 300px;
    margin-left: 6px;
    
    .ant-select-selector {
        background: blue;
        border-color: #e94560;
    }
`;

export const StyledInputGroup = styled(Input.Group)`
    margin-top:5px;
    margin-bottom: 5px;
`;

export const InputPrepend = styled.span`
    width: ${props => props?.width};
    background-color: #e9ecef;
    text-align: center;
    min-height: 32px;
`;

export const StyledGroupCard = styled(Card)`
    margin-top: 10px;
    height: calc(100% - 10px);

    & .ant-card-head{
        min-height: 30px
    } 
    & .ant-card-head-title{
        text-align: center;
        padding: 5px 0;
    }
    .ant-card-type-inner {
        width: 240px;
        margin-bottom: 5px;
    }
    & .ant-card-body{
        max-height: 370px;
        overflow: auto;
        ::-webkit-scrollbar{width: 6px;}
        ::-webkit-scrollbar-track {border-radius: 4px; background: 	lightgray;}
        ::-webkit-scrollbar-thumb {border-radius: 4px; background: red;}
    }
    &.partyPeople .ant-card{
        display: inline-block;
        margin-right: 10px;
    }
    &.partyPeople > .ant-card-body {
        max-height: 210px;
        overflow-x: auto;
    }
    .personTitle{
        display: flex;
        align-items: center;
    }
`;

export const StyledToastContainer = styled(ToastContainer)`
  &&&.Toastify__toast-container {}
  .Toastify__toast.Toastify__toast--success {
    background: #52c41a;
  }
  .Toastify__toast.Toastify__toast--warn {
    background: #cc3300;
  }
  .Toastify__toast-body {}
  .Toastify__progress-bar {}
`;