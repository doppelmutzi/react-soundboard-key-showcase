import React, { useEffect, useRef, useReducer, useState } from "react";

import "./Soundboard.scss";

import Headline from "./components/Headline";
import SoundItem from "./components/SoundItem";

import Toggle from "./components/Toggle";
import NowPlaying from "./components/NowPlaying";
import Playback from "./components/Playback";
import FilterSounds from "./components/FilterSounds";

import AppContext from "./AppContext";
import reducer, { getInitialState } from "./reducer";
import useFetch from "./hooks/useFetch";

import styled from "styled-components";

const KeySetup = styled.div`
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 10px;
  }
`;

const Soundboard = () => {
  const [mp3s, error] = useFetch("http://localhost:4000/sounds.json");
  useEffect(() => {
    dispatch({ type: "SET_SOUNDS", sounds: mp3s });
  }, [mp3s]);

  const [state, dispatch] = useReducer(reducer, getInitialState());
  const { darkMode, currentSound, sounds } = state;

  const lastSoundRef = useRef();
  useEffect(() => {
    if (currentSound) lastSoundRef.current = currentSound.label;
  }, [currentSound]);

  const [keyVariant, setKeyVariant] = useState("unique");

  function getKey(mp3, i) {
    switch (keyVariant) {
      case "unique":
        return {
          key: mp3.file,
        };
        break;
      case "unstable":
        return {
          key: Date.now(),
        };
        break;
      case "index":
        return {
          key: i,
        };
        break;
      default:
        return {};
    }
  }

  return (
    <AppContext.Provider value={{ darkMode, currentSound, sounds, dispatch }}>
      <div className={`soundboard ${darkMode && "dark-mode"}`}>
        <Toggle
          id="toggle-dark-mode"
          onToggle={() => {
            dispatch({ type: "TOGGLE_DARK_MODE", darkMode: !darkMode });
          }}
        >
          dark mode
        </Toggle>
        <Headline>Sound Board</Headline>
        <NowPlaying current={currentSound?.label} last={lastSoundRef.current} />
        <Playback />
        <FilterSounds />

        <KeySetup>
          <h5>Key variants</h5>
          <select
            value={keyVariant}
            onChange={(evt) => {
              setKeyVariant(evt.target.value);
            }}
          >
            <option value="unique">unique</option>
            <option value="no">no key</option>
            <option value="index">index</option>
            <option value="unstable">unstable</option>
          </select>
        </KeySetup>

        {error ? (
          <div>Sounds konnten leider nicht geladen werden</div>
        ) : (
          // eslint-disable-next-line react/jsx-key
          sounds.map((mp3, i) => <SoundItem mp3={mp3} {...getKey(mp3, i)} />)
        )}
      </div>
    </AppContext.Provider>
  );
};

export default Soundboard;
