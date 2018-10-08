# rematch-logic
🕶 redux-login in rematch

## Instalation

```
npm install -g rematch-logic
or
yarn add rematch-logic
```

## Setup

```js
import todo from './models/todo';
import { createLogicMiddleware } from 'redux-logic';

const logicMiddleware = createLogicMiddleware([], {});

const store = init({
  models: {
    todo
  },
  plugins: [
    rematchLogicPlugin(logicMiddleware),
  ],
  redux: {
    middlewares: [logicMiddleware]
  }
});
```

## Usage

```js
const model = {
  name: 'todo',
  state: [],
  reducers: {
    addTodo(state, payload) {
      return state.concat([payload])
    },
    removeTodo(state, index) {
      return state.filter((i, idx) => idx !== index);
    }
  },
  logics: [
    {
      type: [
        'todo/addTodo',
        'todo/removeTodo'
      ],
      latest: true,
      process({ getState, action },  dispatch, done) {

        /*
          do some stuff
          use dispatch a la rematch style like dispatch.todo.addTodo
        */ 
       
        done();
      }
    }
  ]
}
```
