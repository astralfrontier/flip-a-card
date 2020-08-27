import React, { useState } from "react"

import Button from "@material-ui/core/Button"
import ButtonGroup from "@material-ui/core/ButtonGroup"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow"

import { identity, map, sortBy, without } from "ramda"
import ClientCards from "./client-card"
import ClientCardDrawer from "./client-card-drawer"

import { concat } from "ramda"

type Card = any; // TODO: better signature

export type Stack = Card[];

export type Stacks = Record<string,Stack>;

type SetStateFunction = Function; // TODO: better signature

interface PlayState {
  allCardsIsOpen: boolean;
  cards: Card[];
}

// Return a random element from an array
const sample = items => items[Math.floor(Math.random() * items.length)]

const dealCard = (stack: Stack, state: PlayState, setState: SetStateFunction) => {
  const newCards = concat(state.cards, [sample(stack)])
  setState({...state, cards: newCards})
}

const discardCard = (state: PlayState, setState: SetStateFunction) => card => {
  const newCards = without([card], state.cards)
  setState({...state, cards: newCards})
}

const newCharacter = (stacks: Stacks, state: PlayState, setState: SetStateFunction) => {
  const newCards = [
    sample(stacks["character/upbringing"]),
    sample(stacks["character/role"]),
    sample(stacks["character/focus"]),
  ]
  setState({...state, cards: newCards})
}

const newEncounter = (stacks: Stacks, state: PlayState, setState: SetStateFunction) => {
  const newCards = [
    sample(stacks["encounter"]),
    sample(stacks["encounter"]),
    sample(stacks["oracle/emotion"]),
  ]
  setState({...state, cards: newCards})
}

const toggleAllCards = (state: PlayState, setState: SetStateFunction) => (allCardsIsOpen) => {
  setState({...state, allCardsIsOpen})
}

const listItemForStack = (stacks: Stacks, stackName: string, state: PlayState, setState: SetStateFunction) => (
  <ListItem key={stackName}>
    <ListItemText primary={stackName} />
    <ListItemSecondaryAction>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => dealCard(stacks[stackName], state, setState)}
      >
        <DoubleArrowIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
)

const CardPage = ({ stacks }: {stacks: Stacks}) => {
  const [state, setState]: [PlayState, SetStateFunction] = useState({
    allCardsIsOpen: false,
    cards: []
  })

  const drawerCallback = toggleAllCards(state, setState)

  return (
    <>
      <ClientCardDrawer
        stacks={stacks}
        cards={state.cards} 
        allCardsIsOpen={state.allCardsIsOpen}
        drawerCallback={drawerCallback} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ButtonGroup
            variant="contained"
            color="secondary"
            aria-label="outlined primary button group"
          >
            <Button onClick={() => drawerCallback(true)}>All Cards</Button>
            <Button onClick={() => newCharacter(stacks, state, setState)}>New Character</Button>
            <Button onClick={() => newEncounter(stacks, state, setState)}>New Encounter</Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} md={4}>
          <List dense={false}>
            {map(
              stackName => listItemForStack(stacks, stackName, state, setState),
              sortBy(identity, Object.keys(stacks))
            )}
          </List>
        </Grid>
        <Grid item xs={12} md={8}>
          <ClientCards cards={state.cards} discardCard={discardCard(state, setState)} />
        </Grid>
      </Grid>
    </>
  )
}

export default CardPage
