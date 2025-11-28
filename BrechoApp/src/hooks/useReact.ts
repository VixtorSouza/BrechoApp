import * as React from "react";

export const useReact = () => ({
  ...React,
  // Add any additional React functions we need to use
  useState: React.useState as typeof React.useState,
  useEffect: React.useEffect as typeof React.useEffect,
  useContext: React.useContext as typeof React.useContext,
  createContext: React.createContext as typeof React.createContext,
});
