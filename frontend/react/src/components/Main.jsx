import React, {useCallback, useEffect, useState} from 'react';
import {Button, Col, Input, Layout, Row} from 'antd';
import {useLocation, useNavigate} from "react-router-dom";
import BeerBar from "./bar/BeerBar";
import queryString from 'query-string';
import {SET_CONTRACT} from '../store/actions';
import {StyledContent, StyledInputGroup, StyledFooter} from "../util/Styling.style";

const {Header} = Layout;

function Main(props) {
  const history = useNavigate();
  const {drizzle} = props;
  const {web3} = drizzle;
  const [blockNumber, setBlockNumber] = useState(0);
  const [barAddress, setBarAddress] = useState();
  const state = drizzle.store.getState();
  const {barAddress: currentAddress} = state.bar;
  const location = useLocation();
  const {dispatch} = drizzle.store;

  const setSongVotingBar = useCallback((address) => {
    dispatch({type: SET_CONTRACT, payload: {address}});
  }, [dispatch]);

  web3.eth.getBlockNumber().then(number => setBlockNumber(number));

  useEffect(() => {
    const {contract} = queryString.parse(location.search);
    if (contract !== currentAddress && contract) {
      setSongVotingBar(contract)
    }
  }, [location.search, setSongVotingBar, currentAddress]);

  useEffect(() => {
    if (state.currentBlock.number) {
      setBlockNumber(state.currentBlock.number);
    }
  }, [state.currentBlock]);

  const loadBar = () => {
    setSongVotingBar(barAddress);
    if (barAddress)
      history({
        pathname: `/`,
        search: `?contract=${barAddress}`,
      });
  };

  const {SongVotingBar} = drizzle.contracts;

  return (
    <>
      <Header>
        <Row display="flex" justify="space-between" align="middle">
          <Col xs={{span: 0}} lg={{span: 8}}/>
          <Col xs={{span: 12}} lg={{span: 8}}>
            <h1 style={{color: "#fff", textAlign: "center"}}>TU Wien Beer Bar</h1>
          </Col>
          <Col xs={{span: 12}} lg={{span: 8}}>
            <StyledInputGroup compact style={{display: "flex", justifyContent: "end"}}>
              <Input
                style={{maxWidth: 300}}
                placeholder="Bar Address"
                onChange={(e) => setBarAddress(e.target.value)}/>
              <Button
                type="primary"
                disabled={(currentAddress === barAddress || !web3.utils.isAddress(barAddress)) && !!barAddress}
                onClick={loadBar}>
                Load Bar
              </Button>
            </StyledInputGroup>
          </Col>
        </Row>
      </Header>

      <StyledContent>
        {SongVotingBar && <BeerBar {...props} />}
      </StyledContent>

      <StyledFooter>
        Latest Block: {blockNumber}
      </StyledFooter>
    </>
  );
}

export default Main;
