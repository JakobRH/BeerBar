import React from 'react';
import Main from "./Main.jsx";
import {DrizzleContext} from '@drizzle/react-plugin';
import {Drizzle} from "@drizzle/store";
import 'react-toastify/dist/ReactToastify.css';
import {StyledToastContainer} from '../util/Styling.style.js';
import {drizzleOptions, store} from "../util/config";
import {Spin} from "antd";

const drizzleInstance = new Drizzle(drizzleOptions, store);

function DrizzleProvider() {
  return (
    <DrizzleContext.Provider drizzle={drizzleInstance}>
      <DrizzleContext.Consumer>
        {drizzleContext => {
          const {drizzle, drizzleState, initialized} = drizzleContext;
          if (!initialized) {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%"
                }}>
                <Spin/>
              </div>
            );
          }
          return (<>
            <StyledToastContainer
              position="top-right"
              autoClose={3000}
              style={{width: "auto"}}
            />
            <Main drizzle={drizzle} drizzleState={drizzleState}/>
          </>);
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
}

export default DrizzleProvider;
