import { createLogic } from 'redux-logic';

let localStore;
let arrLogics = [];

const decorateProcess = (process) => (context, dipatch, done) => {
  process(context, localStore.dispatch, done);
};

const plugin = (logicMiddleware) => ({

  onModel(model) {
    const logics = model.logics || [];

    logics.forEach(logic => {
      if (logic.process) {
        logic.process = decorateProcess(logic.process)
      }
      arrLogics.push(createLogic(logic));
    });
  },

  onStoreCreated(store) {
    localStore = store;
    logicMiddleware.addLogic(arrLogics);
  }
});

export default plugin;
